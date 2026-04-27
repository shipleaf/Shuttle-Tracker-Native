---
name: shuttle-tracker-design
description: Use this skill to generate well-branded interfaces and assets for Shuttle Tracker (셔틀트래커), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping. Visual language is inspired by Karrot (당근) — warm carrot orange, Pretendard, Korean mobile conventions.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. Link `colors_and_type.css` and `ui_kits/app/app.css` for instant access to tokens and components. Use the icon sprite at `assets/icons.svg` via `<svg><use href="..."/></svg>`.

If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand. Preferred stack: React + Pretendard Variable + Tailwind or vanilla CSS mapped to the tokens in `colors_and_type.css`.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface, Korean vs bilingual copy, which of the 3 core flows), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key rules to internalize before designing:
- Primary is **Carrot #FF6F0F** — used sparingly on CTAs, active states, brand marks, selected map markers, and the route polyline. Everything else should be cool neutral gray.
- Type is **Pretendard Variable** with tight tracking (-0.01 to -0.02em). Weights 400/600/700/800.
- Radii: 12px default, 20px sheets, pill for chips/avatars/search.
- Shadows: soft and minimal. Never stack.
- Copy is Korean-first, casual `-요` endings, no decorative emoji.
- Map markers: carrot = selected friend, blue = other friends, numbered circles = stops, carrot halo dot = bus, blue ring = my location.
