# Project memory

## Product intent & audience

- Sound World is a UK England phonics and counting web app for young children, used with a parent nearby.
- Worlds already in the app: trains, planes, dinosaurs, farm, space, and under the sea.
- Family cast: Mum, Dad, Brother, Sister, Dog, and Cat. Names can be edited.

## Brand personality & voice

- Warm, concrete, and short. UK spelling. Baloo 2 for titles and buttons, Nunito for body text.
- No baby talk, no shame on a wrong tap, and no open chat with the child.

## Visual design & UX direction

- Mobile-first column, about 44rem wide. Theme colours come from CSS variables on `data-theme`.
- Tap targets stay large. Photos sit in a frame for the selected world. Cartoons are drawn in the browser from the saved photo.
- Games: Sound Match, Blend Quest, and Family Count.

## Decisions, constraints & rationale

- The app is Vite, React, and TypeScript. There is no backend.
- Profiles and settings stay in localStorage. Photos and cartoons stay in IndexedDB. Do not upload family photos.
- Parent coach opens only after a hold. Tips come from stars already stored on the device.
- The repository is not empty. Keep the existing screens, themes, and games.

## Open questions & assumptions

- Profiles do not sync between devices. There is no account service.
- Out of scope: open child AI chat, handwriting, native app stores, and offline PWA packaging.
