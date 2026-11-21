# Sound World

Interactive **UK England phonics** and early counting for young children — with friendly theme worlds (trains, planes, dinosaurs, farm) and a family cast that guides play.

The phased plan is in [ROADMAP.md](./ROADMAP.md).

## For parents

1. Open the app and create a child profile.
2. Pick a world theme.
3. Play:
   - **Sound Match** — hear a phoneme, tap the matching letter or digraph
   - **Blend Quest** — sound out then blend the word
   - **Family Count** — count 1–10, then 1–20 after the digraph sets open
4. Stars unlock Letters and Sounds sets, then digraphs (`sh`, `ch`, `th`, `ng`, `ai`…), then a few alternative spellings (`ay`, `a-e`, `ea`, `oy`).
5. In **Parent settings**, rename the family, add a photo for each person or pet, and draw an on-device cartoon for the current world.
6. Hold **Parent coach** to see tips from the stars on this device, then practise those words.

Worlds: trains, planes, dinosaurs, farm, space, and under the sea. Reduce motion and higher contrast are in Parent settings.

Progress, names, photos, and cartoons stay **on this device** (`localStorage` and IndexedDB). Other families can open the same public link and set up their own profiles. Photos are not uploaded.

Speech uses your device’s **en-GB** voice when available (tap the speaker buttons). Soft theme music and game sounds start after the first tap; mute them from the home screen or Parent settings.

## For developers

```bash
npm install
npm run dev
npm run build
```

Stack: Vite + React + TypeScript. No backend. Parent coach tips are worked out from stars on the device. Cartoons are drawn in the browser from the saved photo.

### Project layout

- `src/lib/phonics.ts` — Phase 2 graphemes, Phase 3 digraphs, and a few Phase 5 spellings
- `src/lib/speech.ts` — `en-GB` speech helper
- `src/lib/profiles.ts` — child profiles, family cast, sound and comfort settings
- `src/lib/media.ts` — on-device photos and cartoons (IndexedDB)
- `src/lib/coach.ts` — parent tips from unlocked sets
- `src/games/` — Sound Match, Blend Quest, Family Count
- `src/themes/` — trains, planes, dinosaurs, farm, space, sea

Cloud accounts are not included. There is no sign-in service, so profiles cannot sync between devices.

Not in scope: open child AI chat, handwriting, native stores, offline PWA packaging.
