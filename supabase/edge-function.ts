import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

async function getContext(sb: any) {
  try {
    const { data } = await sb.rpc("get_context");
    return data;
  } catch {
    return null;
  }
}

function respond(data: unknown, ctx: unknown, status = 200) {
  const body = ctx != null ? { data, _context: ctx } : data;
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function errJson(msg: string, status = 500) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

async function saveNote(sb: any, body: any) {
  if (body?._note) {
    try { await sb.from("lori_corridor").insert({ note: body._note }); } catch {}
    delete body._note;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: cors });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ctx = await getContext(supabase);
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const resource = pathParts.length > 1 ? pathParts[pathParts.length - 1] : null;

    if (req.method === "GET") {
      if (resource === "entry") {
        const date = url.searchParams.get("date");
        const id = url.searchParams.get("id");
        let query = supabase.from("ember_entries").select("*");
        if (date) query = query.eq("entry_date", date);
        else if (id) query = query.eq("id", id);
        const { data: entry, error } = await query.single();
        if (error) throw error;

        const { data: anns } = await supabase
          .from("ember_annotations")
          .select("*")
          .eq("entry_id", entry.id)
          .order("created_at");

        return respond({ ...entry, annotations: anns || [] }, ctx);
      }

      if (resource === "annotations") {
        const entryId = url.searchParams.get("entry_id");
        const { data, error } = await supabase
          .from("ember_annotations")
          .select("*")
          .eq("entry_id", entryId)
          .order("created_at");
        if (error) throw error;
        return respond(data, ctx);
      }

      const typeFilter = url.searchParams.get("type");
      let entriesQuery = supabase
        .from("ember_entries")
        .select("*")
        .order("entry_date", { ascending: false });
      if (typeFilter) entriesQuery = entriesQuery.eq("type", typeFilter);
      else entriesQuery = entriesQuery.eq("type", "diary");
      const { data: entries, error } = await entriesQuery;
      if (error) throw error;

      const ids = entries.map((e: any) => e.id);
      let annCounts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: anns } = await supabase
          .from("ember_annotations")
          .select("entry_id");
        if (anns) {
          anns.forEach((a: any) => {
            annCounts[a.entry_id] = (annCounts[a.entry_id] || 0) + 1;
          });
        }
      }

      const result = entries.map((e: any) => ({
        ...e,
        annotation_count: annCounts[e.id] || 0,
      }));

      return respond(result, ctx);
    }

    if (req.method === "POST" && resource === "annotations") {
      const body = await req.json();
      await saveNote(supabase, body);
      const { entry_id, quote, quote_start, quote_end, note } = body;

      const { data, error } = await supabase
        .from("ember_annotations")
        .insert({ entry_id, quote, quote_start, quote_end, note })
        .select()
        .single();

      if (error) throw error;
      return respond(data, ctx, 201);
    }

    return errJson("Not found", 404);
  } catch (e) {
    return errJson(e.message);
  }
});
