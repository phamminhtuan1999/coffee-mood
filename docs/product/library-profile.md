# Saved Library, Profile, Settings, System States

Personal library and utility surfaces. Polished but never more important than
the map.

## Saved Cafés

The user's personal coffee map. Tabs: Want to Try, Work Spots, Date Spots,
Aesthetic, Visited. View modes: Map, Grid, List — default map or grid, never a
boring list. Card: photo, name, tags, distance, score, collection label, quick
actions (Directions, Remove, Share).

## Collections

**Collection Detail** (example "Best Work Cafés in San Diego"): cover collage,
name, café count, map preview, café cards, share, edit, Private/Public toggle.
Feels like a curated local guide.

**Edit Collection**: name, description, cover image, privacy, reorder, remove.
CTA "Save Changes".

## Taste Profile

"Your café taste": stats (42% Work-friendly, 28% Aesthetic, 18% Specialty
Coffee, 12% Outdoor), favorite vibes, favorite neighborhoods, saved tags,
recently visited, recommendations. Warm charts/cards — not a corporate
dashboard.

## Profile

Avatar, name, saved/collections/visited counts, taste profile shortcut,
settings shortcut. Actions: edit profile, manage preferences.

## Settings

- Account: email, sign out.
- Preferences: default location, distance unit, default vibe, notifications.
- Privacy: location settings, public/private collections, delete account.

Simple, clean, warm; may be less visual but must match the system.

**Notification Preferences**: toggles for new cafés near me, saved café
reminders, weekend route ideas, friend recommendations, café vibe updates.
Calm and non-spammy.

## Bottom Tab Bar

Tabs: Map, Search, Saved, Routes, Profile. Clear selected/unselected states.

## App-Wide States

Empty: no cafés nearby ("Expand Search"), no saved cafés ("Your coffee map is
empty." / "Explore Cafés"), no search results ("No match for that vibe." /
"Reset Filters"), no routes ("Generate Route"), location denied ("Choose
Location"), offline ("You're offline." / "Saved cafés are still available." /
"Retry").

Loading: skeleton cards, skeleton photo pins, soft shimmer, warm surfaces —
never spinner-only screens.

Errors: helpful, not scary — API failed, location unavailable, AI unavailable,
image failed, save failed. Example: "Couldn't load café vibes. Try again, or
explore saved cafés while we reconnect."

## Contract Notes

- Delete account and privacy controls are audit/security + data-model flagged
  work at implementation time.
- Notifications imply Expo Notifications + provider setup (external systems).
