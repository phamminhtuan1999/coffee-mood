# Map Discovery, Search, AI Finder

The heart of the product. Map-first and visual-first — never a listing app.

## Main Map Home

Full-screen interactive map — live Apple Maps via react-native-maps as of
US-030/decision 0023; the design comps' custom warm map style applies only if
the provider ever moves to Mapbox — with:

- Floating rounded search bar — placeholder "Search cafés, vibes, or
  neighborhoods".
- Horizontal vibe chips: Work, Aesthetic, Date, Quiet, Outdoor, Open Now,
  Parking.
- Custom café photo pins: circular photo thumbnail, warm border, tiny score
  badge; selected state larger; saved state shows bookmark badge; clustered
  photo markers.
- Current-location floating button and "Ask AI" floating pill.
- Café preview bottom sheet (32px top radius, draggable handle).

Reference café for design/dev parity: **Mostra Coffee** — tags Aesthetic /
Specialty Coffee / Good Latte; scores Aesthetic 9.1, Coffee 8.8, Work 6.5;
AI summary "Great coffee and cozy interior. Better for casual hangout or
photos than long work sessions."; actions Save / Directions / View Photos.

## Bottom Sheet States

- **Collapsed**: name, main score, one-line vibe.
- **Half**: photo, name, tags, score row, AI summary, Save/Directions/Photos.
- **Expanded**: more photos, why it matches, people love, watch out for,
  add to route.

## Search

Normal + semantic queries ("quiet cafe with parking", "cute matcha place",
"work cafe open late", "date spot near La Jolla"). Sections: recent searches,
suggested searches, visual result cards, mini map preview. Result card: photo,
name, distance, vibe tags, match reason, score badge. Editorial cards — no
plain Yelp rows.

## AI Café Finder

Headline "What kind of café are you looking for?"; free-text prompt
(placeholder: "Example: I need a quiet café to work for 3 hours with parking
and good latte."); suggested chips (Quiet work spot, Cute date café, Aesthetic
photos, Good latte, Open late, Outdoor chill). Warm AI card — not a chatbot UI.

**AI Result**: best match with reasons; alternatives ("Better for work:
Communal Coffee", "Better for photos: Garden Café", "Better for parking:
Better Buzz"); actions View on Map / Save / Get Directions / Refine Search;
confidence line "Based on reviews, photos, hours, and your taste profile."

## Advanced Filters

"Mood tuning", not a database panel: distance, open now, price, rating,
aesthetic score, work score, noise level, parking, Wi-Fi, outlets, outdoor
seating, good for groups/dates, specialty coffee, matcha, dessert, late night.
Chips + sliders + warm grouped cards; Apply / Reset.

## System States

- Loading: skeleton photo pins + soft loading card (never spinner-only).
- No cafés nearby: "No café vibes found nearby." / "Try expanding your
  distance or choosing another neighborhood." CTA "Expand Search".
- Location denied: "Location is off." CTAs Choose Location / Enable Location.
- AI unavailable: "CafeMood AI is taking a coffee break." CTA "Browse Map".

## Contract Notes

- Map provider and AI provider are external systems (high-risk lane at
  implementation; providers proposed in decision 0008, AI server-side only).
- Map home is live: Apple Maps via react-native-maps (decision 0023,
  superseding 0010's Mapbox proposal). Cafe pins are real places from the
  OpenStreetMap Overpass API around the device location (decision 0024,
  US-031), falling back to the curated San Diego fixtures on any
  location/network failure. AI finder is live via Groq/Supabase (decisions
  0021/0022) and ranks those same real nearby cafes when the map cache is
  warm (decision 0026, US-033); the four fixtures remain the cold-cache/demo
  candidate pool.
- Semantic search quality depends on vibe/score data model — schema is a
  data-model risk flag when defined.
