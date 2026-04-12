# Pokédex App — Feature Roadmap

A breakdown of features that would make sense to add to this app, organized by category and rough priority.

---

## Currently Implemented

- Browse all Pokémon with infinite scroll (20 per page)
- Search by name (debounced, works on both list and favorites)
- Favorites with persistence (AsyncStorage)
- Detail view: types, stats, abilities, height, weight, base experience
- Type-based color coding on cards

---

## Feature Ideas

### Pokémon Data & Detail

- [ ] **Evolution chain** — Show the full evolution line (e.g., Bulbasaur → Ivysaur → Venusaur) with evolution conditions (level, item, trade)
- [ ] **Move list** — Display moves the Pokémon can learn, grouped by learn method (level-up, TM, egg moves)
- [ ] **Held items** — Show items the Pokémon can hold in the wild and their rarity
- [ ] **Type effectiveness chart** — Show damage multipliers for all 18 types against the selected Pokémon (weak to, resistant to, immune to)
- [ ] **Pokédex entries** — Display the flavor text descriptions from different game versions
- [ ] **Gender ratio** — Show male/female split or genderless status
- [ ] **Egg groups & hatch time** — Useful for breeding mechanics
- [ ] **Base friendship & growth rate** — Show base happiness value and EXP curve type
- [ ] **Alternative forms** — Support Mega Evolutions, regional variants (Alolan, Galarian, etc.), and other formes
- [ ] **Shiny sprite toggle** — Let users switch between normal and shiny artwork on the detail screen

---

### Browsing & Filtering

- [ ] **Filter by type** — Chip or dropdown filter to show only Pokémon of a selected type (or combination of two types)
- [ ] **Filter by generation** — Show Pokémon from Gen I through Gen IX separately
- [ ] **Sort options** — Sort the list by ID, name (A–Z), base stat total, or a specific stat
- [ ] **Search by type or ability** — Extend search beyond just name
- [ ] **Generation selector** — Quick-switch between generations from the home screen

---

### Favorites & Collections

- [ ] **Favorites sorting & filtering** — Same sort/filter options as the main list, applied to saved favorites
- [ ] **Custom collections / teams** — Let users create named lists (e.g., "My Team", "Ghost Mono Run") and add Pokémon to them
- [ ] **Team builder** — Compose a team of up to 6, view combined type coverage and weaknesses
- [ ] **Export team** — Share a team as an image or plain-text list

---

### UI & Experience

- [ ] **Dark / light mode** — Respect system preference or let the user toggle manually
- [ ] **Haptic feedback** — Light vibration on favorite toggle and button taps
- [ ] **Animated transitions** — Smooth shared-element transition from card to detail screen
- [ ] **Stat bar animations** — Animate the stat bars filling up when the detail screen opens
- [ ] **Compare view** — Side-by-side stat comparison of two Pokémon
- [ ] **Random Pokémon button** — "Surprise me" button that navigates to a random Pokémon's detail screen

---

### Search & Discovery

- [ ] **Recent searches** — Persist and display the last few search queries for quick re-use
- [ ] **Search suggestions / autocomplete** — Show name suggestions as the user types
- [ ] **Ability detail screen** — Tap an ability name on the detail screen to see its full description and which other Pokémon have it

---

### Offline & Performance

- [ ] **Offline mode** — Cache fetched Pokémon data so the app works without an internet connection
- [ ] **Image pre-caching** — Pre-download artwork for visible and nearby cards to reduce flicker
- [ ] **Background data sync** — Refresh cached data silently when the app is opened with a connection

---

### Onboarding & Settings

- [ ] **Onboarding flow** — Brief walkthrough on first launch explaining key features
- [ ] **Settings screen** — Central place for display preferences (theme, language, sprite style)
- [ ] **Language / localization** — Pokémon names and Pokédex entries in multiple languages (PokéAPI supports this)
- [ ] **Notifications** — Optional reminder to check the daily featured Pokémon (if that feature is added)

---

### Social & Sharing

- [ ] **Share Pokémon card** — Generate a shareable image of a Pokémon's card or stats
- [ ] **Deep links** — Open a specific Pokémon detail screen from a shared URL (e.g., `pokedex://pokemon/6`)

---

### Gamification

- [ ] **Daily featured Pokémon** — Highlight one Pokémon per day with a special badge
- [ ] **Seen / caught tracker** — Let users mark which Pokémon they've seen or caught in their games
- [ ] **Quiz / trivia mode** — "Which Pokémon is this?" silhouette guessing game using the existing artwork

---

## Priority Suggestion

If prioritizing by user value vs. implementation effort:

| Priority | Feature |
|----------|---------|
| High | Evolution chain, type effectiveness chart, filter by type |
| High | Dark/light mode, stat bar animations |
| Medium | Move list, generation filter, sort options |
| Medium | Custom collections / team builder |
| Medium | Offline mode / caching |
| Lower | Quiz mode, sharing, deep links, notifications |
