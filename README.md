# Sound World

Interactive **UK England phonics** and early counting for young children — with friendly theme worlds (trains, planes, dinosaurs, farm) and a family cast that guides play.

## For parents

1. Open the app and create a child profile.
2. Pick a world theme.
3. Play:
   - **Sound Match** — hear a phoneme, tap the matching letter
   - **Blend Quest** — sound out then blend Phase 2 CVC words
   - **Family Count** — count 1–10 theme and family items
4. Stars unlock more Letters and Sounds Phase 2 sets.
5. In **Parent settings**, rename Mum, Dad, Brother, Sister, Dog, and Cat.

Progress and profiles stay **on this device** (`localStorage`). Other families can open the same public link and set up their own profiles.

Speech uses your device’s **en-GB** voice when available (tap the speaker buttons). Soft theme music and game sounds start after the first tap; mute them from the home screen or Parent settings.

## For developers

```bash
npm install
npm run dev
npm run build
```

Stack: Vite + React + TypeScript. No backend required for Phase 1.

### Project layout

- `src/lib/phonics.ts` — Letters and Sounds Phase 2 graphemes & CVC words
- `src/lib/speech.ts` — `en-GB` speech helper
- `src/lib/profiles.ts` — child profiles + family cast in localStorage
- `src/games/` — Sound Match, Blend Quest, Family Count
- `src/themes/` — theme ids and count glyphs

### Roadmap (later)

- Phase 1b: on-device family photo frames
- Phase 2: digraphs + counting to 20
- Phase 3: gated Parent Coach AI + themed caricatures
- Phase 4: extra themes, accessibility polish

Not in scope: open child AI chat, handwriting, native stores, offline PWA packaging.
