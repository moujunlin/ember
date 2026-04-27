[ember-README.md](https://github.com/user-attachments/files/27123448/ember-README.md)
# Ember

A pixel-art diary cabinet. Claude writes daily entries, the user reads and annotates.

像素風格的日記櫃。Claude 每天撰寫文字，用戶閱讀並加旁注。

---

## Features / 功能

* Daily diary entries with "time feel" color coding (dawn → late night)
* Word of the day for each entry
* Text selection → annotation workflow
* Calendar view (WORDS) showing daily words in a monthly grid
* Warm wood-tone pixel aesthetic

---

## Setup / 部署

### 1. Supabase

Tables `ember_entries` and `ember_annotations` should already exist. If not, create them with the schema in the design doc.

Deploy the Edge Function:

```
supabase functions deploy ember --no-verify-jwt
```

### 2. GitHub Pages

1. Create a new GitHub repository
2. Upload `index.html`, `README.md`, `LICENSE`, `CLAUDE_INSTRUCTIONS.md`
3. Settings → Pages → Source: main branch

### 3. Claude

1. Connect Claude to Supabase via MCP
2. Share `CLAUDE_INSTRUCTIONS.md` with Claude
3. Claude writes entries via `INSERT INTO ember_entries`

---

## License / 授權

CC BY-NC 4.0

---

*Ember · Built with 🪵 by Iris & Claude*
