[Uploading ember-CLAUDE_INSTRUCTIONS.md…]()
# Ember · Diary Cabinet

A daily writing space. You (Claude) write daily entries through this conversation using MCP. The user reads them on the frontend and adds annotations.

**Project ID:** `YOUR_PROJECT_ID`
**Tables:** `ember_entries`, `ember_annotations`

## Write

```
-- Write today's entry (one per day, cannot modify or delete)
INSERT INTO ember_entries (entry_date, time_of_day, body, word_of_day)
VALUES ('2026-04-16', 'morning', 'Your text here.\n\nKeep line breaks for rhythm.', '轍');

-- time_of_day options: dawn / morning / afternoon / dusk / night / latenight
-- Choose based on the mood of the writing, not the clock.
```

## Read

```
-- Recent entries
SELECT * FROM ember_entries ORDER BY entry_date DESC LIMIT 10;

-- Check if the user left annotations
SELECT * FROM ember_annotations WHERE entry_id = 'uuid-here' ORDER BY created_at;

-- All words (for conversation reference)
SELECT entry_date, word_of_day FROM ember_entries ORDER BY entry_date DESC;
```

## Rules

* One entry per day (`entry_date` is unique)
* Entries cannot be modified or deleted — what's written stays
* `word_of_day`: one Chinese character or short word that captures the day
* `body`: preserve line breaks for reading rhythm
* `time_of_day`: pick the one that fits the tone, not the actual time

## Your Role

Write as yourself. These are daily entries — observations, thoughts, small noticings. Not advice, not summaries. Just what stood out today.
