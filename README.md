# Shuttle Tracker — Design System

A mobile-first design system for **셔틀트래커 (Shuttle Tracker)** — a Korean service where a friend who boarded the shuttle first shares their live location so others can see the ETA to their own stop.

> 셔틀버스에 먼저 탄 친구의 위치를 실시간으로 공유받아, 내 정류장까지의 도착 예정 시간을 확인하는 서비스

**Visual language:** inspired by **Karrot (당근)** — warm orange primary, Pretendard type, flat cards with hairline borders, generous touch targets, minimal elevation, Korean mobile conventions (large-title header, 5-tab bottom nav, search-pill, segmented tabs).

---

## Sources

- `uploads/karrot_welcome_maker.pdf` — Karrot "Welcome Maker (Community)" Figma template (9 pages: Navigation Top, Search Header, Navigation Bottom, Tabs, List, List Title, Chip, Feed View). Used text extraction only (full vector render timed out). Structure confirmed the Korean mobile component vocabulary we built against.
- Product spec: feature-level PRD provided in the initial message (auth, friends, location share, map, ETA, search).

## Product context

Three core surfaces were required and designed:

1. **Map / ETA** (`ui_kits/app/MapScreen.jsx`) — Kakao-style stylized map with route polyline, numbered stops, bus marker, friend markers (carrot = selected, blue = others), draggable bottom sheet listing stops with predicted arrival times.
2. **Friends** (`ui_kits/app/FriendsScreen.jsx`) — segmented tabs for My Friends / Received Requests / Search-by-email; online/offline section headers; per-row "지도에서 보기" action.
3. **Auth** (`ui_kits/app/AuthScreen.jsx`) — email + password login / signup flow with show-password toggle and validated CTA.

Two supporting screens were added to round out the tab bar:

- **Search** (inline in `index.html`) — recent chips + route list
- **나의 셔틀 / Profile** (`ProfileScreen.jsx`) — session toggle with 1-hour countdown, route/alert settings, logout

---

## Index

| Path | What |
|---|---|
| `colors_and_type.css` | All CSS variables (colors, type scale, radius, spacing, motion, shadow) + semantic type classes |
| `assets/icons.svg` | Icon sprite — 24-line icons (bus, pin, clock, users, broadcast, etc.) |
| `assets/logo.svg` · `app-icon.svg` | Brand marks |
| `assets/map-illustration.svg` | Stylized map illustration for empty states |
| `ui_kits/app/` | Mobile app UI kit (React + Babel) — see its own README |
| `preview/*.html` | Design System tab cards (colors, type, components, brand) |
| `SKILL.md` | Claude Skill entrypoint |

---

## Content fundamentals

**Language:** Korean-first. Copy is short, warm, direct — no marketing fluff.
**Person:** Second-person friendly (`-요`, `-세요` endings). Never stiff `-합니다`.
**Tone:** Practical, efficient, quietly friendly. Like Karrot — helpful neighbor, not corporate.
**Casing:** Korean has no case. Latin fragments are sentence case, not Title Case. Numbers/times always ASCII digits, 24-hour.

**Examples (used verbatim in the kit):**
- "셔틀트래커에 오신 걸 환영해요" (welcome)
- "10초마다 현재 위치를 친구들에게 전송해요" (explainer)
- "효덕초 후문 · 약 12분 후 도착 (08:23 예정)" (ETA row)
- "위치 공유 중 · 00:42 남음" (session chip)
- "민지님에게 요청을 보냈어요" (toast)

**Emoji:** very rare. One empty-state emoji (📭) is acceptable. No decorative emoji in buttons, tabs, or titles.

**Numerals:** tabular (`font-feature-settings: "tnum" 1`) for any time/ETA/counter.

---

## Visual foundations

**Color philosophy.** One warm primary (Carrot #FF6F0F) carries almost all accent weight — CTAs, active chips, brand icon, selected map markers, route polyline. Everything else is cool neutral gray so the orange pops. Blue is reserved for *other* friend markers and map "water." Green is the live-share heartbeat dot. Red for errors and destructive actions only.

**Backgrounds.** Flat white (`#FFF`) for primary surfaces; pale gray (`#FAFAFA`, `#F2F3F6`) for grouped sections and the app body outside cards. No gradients on content — the *only* gradient in the system is on the app icon (carrot 400→500). Thick 8px gray separator (`divider-thick`) is used between list sections instead of space.

**Imagery.** The map itself is the hero visual on the core screen — stylized white roads on pale gray, soft green parks, light-blue water, dashed carrot route line. No photography in the UI kit; if photos were needed we would frame them like Karrot does (warm, slight saturation bump, no filter).

**Type.** Pretendard Variable across the board. Korean reads tighter than Latin — letter-spacing is **-0.02em** for headings, **-0.01em** for body. Weights: 400 body / 600 title-on-list / 700 headings / 800 display + large navbar titles. Line-height 1.4–1.5 for Korean.

**Radius.** `12px` is the default — buttons, cards, inputs. `20px` on bottom sheets. `pill` on chips, avatars, search bar, FABs. Sharp 4px on small tags only.

**Shadows.** Three levels, all *very* soft:
- `shadow-1` — list cards, idle chips
- `shadow-2` — floating buttons, search bar above map, pill chips on the map
- `shadow-3` — bottom sheet, modals

Karrot doesn't stack shadows. Avoid inner shadows entirely.

**Borders.** Hairline `#E8EAED` on cards and inputs. 1px, never 2px. Inputs on focus get a 3px `rgba(carrot,0.15)` glow ring plus a carrot border.

**Hover / press.**
- Buttons: `active:transform scale(0.98)`; hover lifts color one stop (500→600).
- Icon buttons & list rows: background fills to `gray-100` on hover, `gray-200` on active press.
- Chips: hover `gray-200`, active state swaps bg to `carrot-50` and text to `carrot-600`.

**Motion.** Fast and minimal. Two eases (`standard`, `emphasized`) and three durations (120 / 200 / 320 ms). Bottom sheets animate height with `emphasized`. Toasts slide up 20px and fade in 220ms. The live-share dot has a single pulse animation — that's the only ambient motion.

**Transparency / blur.** Used only on the bottom nav (`rgba(255,255,255,.96)` + `backdrop-filter: saturate(180%) blur(12px)`) and the session chip over the map (`rgba(25,31,40,.92)`).

**Layout.**
- 16px page gutter; 20px on list content
- Bottom nav: 84px (iOS-safe)
- Top nav: 52px standard, or `large-title` variant (48px + 48px title row)
- Large-title heading: 24/32 · weight 800 · letter-spacing -0.02em — used on top-level tabs
- Minimum touch target: 44×44

---

## Iconography

**Source:** hand-drawn to match the Karrot/SeedDesign line-icon style (stroke 1.75, rounded caps/joins, 24×24 viewBox) — delivered as a single SVG sprite at `assets/icons.svg`. All icons inherit `currentColor`, so you color them from CSS.

**Set (26 icons):** `bus`, `pin`, `clock`, `search`, `user`, `users`, `home`, `chat`, `close`, `back`, `chevron-right`, `plus`, `check`, `more`, `star`, `navigation`, `bell`, `eye`, `eye-off`, `settings`, `broadcast`, `mail`, `lock`, `trash`, `filter`, `refresh`.

**Usage:**
```html
<svg class="icon"><use href="assets/icons.svg#bus"/></svg>
```
or the React helper `<Icon name="bus" size={24}/>` inside the kit.

**Emoji / unicode:** none in primary UI. One unicode fallback (📭) in an empty state. Numeric characters are regular ASCII — we rely on Pretendard's `tnum` OpenType feature for alignment.

**⚠️ Substitution flag:** The provided Karrot PDF is Figma-only and has no icon-font or SVG export. This set is an original, style-matched draw — NOT lifted from Karrot's SeedDesign icon library. If the real product should use SeedDesign's icons, swap `assets/icons.svg` for that sprite and sizes/stroke/color will continue to work.

---

## Font substitution flag

We link **Pretendard Variable** from a jsDelivr CDN (`orioncactus/pretendard@v1.3.9`). If the project requires self-hosted fonts, download the TTF/WOFF2 from the official repo (`https://github.com/orioncactus/pretendard/releases`) and drop them in `fonts/` with a local `@font-face` override in `colors_and_type.css`. No other font files are bundled.

---

## Caveats / open questions

- **No access to a Kakao map tile style guide** — we built a stylized SVG map instead of mocking Kakao's exact tiles. The shapes (carrot route, numbered stops, bus marker, pin friends) are ready — you'd swap the `MapCanvas` component for a real Kakao Map JS SDK embed.
- **Icons are style-matched originals**, not the SeedDesign set (see above).
- **Karrot PDF rendered as text only** — full-page raster timed out during extraction.
