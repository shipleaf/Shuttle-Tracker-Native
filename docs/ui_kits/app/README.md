# Shuttle Tracker — Mobile App UI Kit

A high-fidelity recreation of the Shuttle Tracker mobile app, built in the Karrot (당근) visual language.

## Screens
- **AuthScreen** — Login / signup (email + password)
- **MapScreen** — The core screen. Kakao-style stylized map with route polyline, stops, bus marker, friend markers (selected = carrot, others = blue), and a draggable bottom sheet with ETA stepper.
- **FriendsScreen** — Tabs for my friends / received requests / email search
- **ProfileScreen** — Profile + location-sharing session toggle with 1h countdown
- **SearchScreen** (inline in index.html) — Unified search with recents and routes

## Components (Frame.jsx)
`AppFrame`, `StatusBar`, `HomeIndicator`, `TopNav`, `BottomNav`, `IconButton`, `Button`, `Avatar`, `Field`, `IconInput`, `Toast`, `Icon`.

## Running
Open `index.html`. The top picker lets you jump between screens. Tapping the bottom nav swaps between Map / Friends / Search / My Shuttle.

## Visual references
- Korean mobile vocabulary (status bar, large-title header, 5-tab bottom nav, segmented pills, chip row)
- Warm carrot-orange primary (`#FF6F0F`)
- Pretendard Variable font
- Flat cards with hairline borders, 12–16px radii
- Minimal elevation (one soft shadow for floating sheets)
