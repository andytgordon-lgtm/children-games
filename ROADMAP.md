# Sound World — Roadmap

**App name:** Sound World
**Audience:** young children (UK England phonics) + parents

## Status in this repository

Phases 0, 1, 1b, and 2 are in the app. Phase 3 runs on the device: hold-to-open tips from stored stars, and a cartoon drawn in the browser. Phase 4 is in the app except cloud accounts. There is no server and no sign-in, so profiles cannot sync, and cartoons are not sent to a model.

## Vision

An interactive UK phonics and counting web app. Families pick a friendly world (dinosaurs, planes, trains, farm animals, space, under the sea). Mum, Dad, Brother, Sister and pets guide play — optionally from **family photos turned into themed cartoon pictures** that animate in that world. Other parents can open the same public link and set up their own child profiles. A gated Parent Coach gives tips and practice suggestions — never freeform chat with the child.

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

## Phase 3 — Parent Coach + themed pictures

- Adult-gated Parent Coach panel
- Tips + next sounds/words from recent progress
- Tips are worked out on the device from stored stars. There is no server model call.
- Kid-facing help is limited to practice word sets + family cheers (no open chat)
- From each uploaded photo, draw a friendly picture dressed for the **currently selected theme**. Pets stay pets.
- Keep one picture per theme cached on-device
- If drawing fails, keep the framed photo

## Phase 4 — Polish & share

- Extra theme packs: space and under the sea
- Cloud-synced profiles are not included. There is no account service.
- Phase 5 alternative spellings (`ay`, `a-e`, `ea`, `oy`) behind stars
- Accessibility: reduced motion and higher contrast
- “Draw again” for a picture, with pet-friendly marks so dog and cat still look like pets

## Out of scope (for now)

Open child AI chat, handwriting practice, native app stores, offline PWA packaging, sharing family photos to other users’ devices.

## Defaults already locked

- **Themes:** trains, planes, dinosaurs, farm, space, under the sea
- **Family faces:** photos stay on the device in themed frames; pictures are drawn in the browser
- **Sharing:** public link + on-device child profiles
- **Coach:** tips from stars on this device, opened with a hold
