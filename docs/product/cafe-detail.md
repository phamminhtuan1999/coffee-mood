# Café Detail, Gallery, Review Insight, Save

Helps the user decide: right for my mood? Worth visiting? Save it? Navigate?
Editorial and photo-rich, never dense Yelp-style information.

## Café Detail

- Top: large image/video carousel, café name, distance, open/closed, vibe tags.
- Score cards (example Mostra Coffee): Aesthetic 9.1, Coffee 8.8, Work 6.5,
  Quiet 7.2.
- Details: address, hours, price, parking, Wi-Fi, outdoor seating, best time
  to visit, crowd estimate.
- AI summary (grounded, editorial tone).
- Sections: Why it matches your mood, People love, Watch out for, Best time to
  visit, Similar cafés nearby.
- Actions: Save, Directions, Share, Add to Route, View Photos, Open in Google
  Maps. Directions and Open in Google Maps are live OS/web maps deep links at
  the cafe's real coordinates (US-032, decision 0025); Share providers stay
  deferred (0015).

States: loading (image/score/summary skeletons), error ("Couldn't load this
café." CTA "Try Again"), limited data ("Limited vibe data — we're still
learning about this spot."). Live map cafes (US-031, decision 0024) open in
the limited-data state with real OSM facts (address, hours, Wi-Fi, outdoor
seating) and estimate-labeled scores; a live detail opened without the map's
session cache falls back to the error state.

## Photo / Video Gallery

Pinterest-feel masonry grid. Tabs: Interior, Drinks, Seating, Outdoor, Work
Setup, Date Vibe. Photo tags: Cozy, Bright, Crowded, Laptop-friendly,
Aesthetic, Outdoor. Warm overlays, soft radius, tap-to-detail state.

## Review Insight

Smart editorial insight (not chatbot): People love (latte quality, interior,
staff) / People complain about (parking, crowded weekends, limited outlets) /
Best for (quick coffee, casual meetup, photos) / Not ideal for (long work
sessions) / Best time (weekday mornings before 10 AM).

## Save Flow

- **Save to Collection** (sheet/modal): collections (Want to Try, Work Spots,
  Date Spots, Aesthetic, Best Latte, Hidden Gems), create new, private note
  (placeholder "Try on a weekday morning."), Save Café / Cancel.
- **Create Collection**: name, optional description, Private/Public toggle,
  suggested names (Cute Date Cafés, Work Spots, Matcha Places, Weekend Finds).

## Share Café Card

Instagram-story-shareable but premium: café photo, name, main vibe tag,
aesthetic score, short AI summary, small CafeMood branding. Actions: copy
link, share image, send to friend.
