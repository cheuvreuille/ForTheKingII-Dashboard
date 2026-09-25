# Chronicle — local co-op statistics overlay

Chronicle is a privacy-first, unofficial companion dashboard for **For The King II**. It is designed to sit beside or over a game window and track only the events a player records. It does **not** inspect game memory, inject code, automate inputs, modify files, intercept network traffic, or communicate with other players.

## Run it

No build step or dependencies are required:

```bash
python3 -m http.server 4173
# open http://localhost:4173
```

Use **Record event** to add an action, attack, or dice roll. Data is stored only in browser `localStorage`. The header controls can hide names, switch to the compact overlay view, export a JSON backup, or clear the session.

## Overlay use

The safest option is to run the game in borderless/windowed mode and keep Chronicle in a separate browser window. Streaming software can also add the page as a browser source. Before using any always-on-top utility, overlay injector, or tournament setup, check the current game, Steam, server, and event rules.

Chronicle deliberately offers no live game capture or automatic extraction. Automatic telemetry should only be added if the publisher provides a documented, permitted API or log format.

## Compliance and safety

- All processing is local; the page makes no network requests.
- No credentials, Steam IDs, or game files are read.
- The UI tracks descriptive history only and does not recommend moves or reveal hidden state.
- “Privacy mode” masks character names for streaming.
- Exported JSON contains only the visible session data and schema version.

This project is not affiliated with, endorsed by, or sponsored by IronOak Games, Curve Games, or Valve. **For The King**, **Steam**, and related marks belong to their respective owners. No software can guarantee acceptance by every anti-cheat system or ruleset; users remain responsible for reviewing the applicable current agreements.
