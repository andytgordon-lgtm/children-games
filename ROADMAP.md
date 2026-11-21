# Sound World — Roadmap

**App name:** Sound World  
**Audience:** young children (UK England phonics) + parents

## Vision

An interactive UK phonics and counting web app. Families pick a friendly world (dinosaurs, planes, trains, farm animals). Mum, Dad, Brother, Sister and pets guide play — optionally from **family photos turned into themed cartoon caricatures** that animate in that world. Other parents can open the same public link and set up their own child profiles. A gated Parent Coach uses AI for tips and practice suggestions — never freeform chat with the child.

## Phase 0 — Foundations

- Scaffold Vite + React + TypeScript in this repo
- Brand as **Sound World**; README for parents/devs
- Theme system + CSS variables (trains, planes, dinosaurs, farm)
- `en-GB` speech helper; localStorage child profiles
- Family cast defaults (Mum, Dad, Brother, Sister, Dog, Cat) with rename in parent settings

## Phase 1 — Core play (MVP to publish)

- **Sound Match** — hear phoneme → tap grapheme; theme reward motion
- **Blend Quest** — sound out then blend CVC words (Phase 2)
- **Family Count** — count 1–10 theme items / family / pets
- Letters and Sounds **Phase 2** content; stars unlock progress
- Huge tap targets; mobile-first layout
- Publish public Cursor app (`sound-world`) so other parents can try it

## Phase 1b — Family photos in the theme

- Parent settings: upload a photo for each cast member (Mum, Dad, Brother, Sister, Dog, Cat)
- Photos stay **on-device** (compressed in IndexedDB) — not uploaded to a public gallery
- Immediate play: photo sits in a **theme frame** (train window, plane window, dino egg oval, farm barn door) with light costume overlays (hat / scarf matching the selected world)
- Soft **animations** while guiding play: idle bob, cheer bounce, wave on correct answer; counting scenes can show the real family faces among theme items
- Switching theme re-skins frames and overlays for every uploaded face

## Phase 2 — Digraphs + deeper counting

- Unlock **Phase 3** digraphs (`sh ch th ng ai ee…`)
- Counting stretch to 20
- More theme-skinned success animations
- Simple star/phase progress view for parents

## Phase 3 — AI Parent Coach + themed caricatures

- Adult-gated Parent Coach panel
- Tips + next sounds/words from recent progress
- Server-side LLM call via app secret; mock tips when unset
- Kid-facing AI limited to practice word sets + family cheers (no open chat)
- **AI caricature pass:** from each uploaded photo, generate a friendly cartoon caricature dressed for the **currently selected theme** (e.g. dino explorer, pilot, train conductor, farmer) — cute and child-safe, not photorealistic scary
- Regenerate when the parent changes theme (or keep one caricature per theme cached on-device)
- If the API key is unset: keep Phase 1b framed photos + overlays (no broken empty faces)

## Phase 4 — Polish & share

- Extra theme packs (e.g. space, under the sea) if wanted
- Optional cloud-synced profiles / signed-in parents
- Soft Phase 5 alternative spellings behind stars
- Accessibility pass (reduced motion, contrast)
- Optional “re-draw caricature” button and pet-friendly prompts (dog/cat still look like pets)

## Out of scope (for now)

Open child AI chat, handwriting practice, native app stores, offline PWA packaging, sharing family photos to other users’ devices.

## Defaults already locked

- **Themes:** user-selectable trains | planes | dinosaurs | farm animals
- **Family faces:** upload photos → themed frames + animation early; AI caricatures when Parent Coach AI is wired
- **Sharing:** public link + on-device child profiles (no cloud sync in Phase 1)
- **AI:** Parent Coach + caricature generation (Phase 3); mock / local frames until API key bound
