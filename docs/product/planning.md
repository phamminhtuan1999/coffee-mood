# Routes, Planners, Check-Ins, Vibe Clips

Features that make CafeMood more than a café directory. Lifestyle experiences,
not logistics screens.

## Mood Route Planner

Inputs: starting area, mood (Aesthetic, Work, Date, Outdoor, Specialty
Coffee), duration (1h / 2h / half day), transport (walk / drive / transit),
number of stops. CTA "Generate Route". Warm form cards + map preview, few
fields at once.

**Route Detail** (example "Saturday Café Route" — "2-hour aesthetic café
hopping route near you"): map with route line, 3 numbered stops (morning
latte, dessert café, sunset chill spot), travel time, distance, parking notes,
vibe summary. Actions: Save Route, Replace Stop, Start Navigation, Share.

**Replace Stop**: current stop + alternative café cards each with a reason
(better parking / more aesthetic / quieter / better coffee). CTA "Replace
Stop".

## Work Session Planner

"I need to work from 9 AM to 12 PM." Fields: start/end time, Wi-Fi, outlets,
quiet level, parking. CTA "Find Work Spots". Practical but premium — not a
calendar app.

**Results**: cards with photo, name, work score, Wi-Fi confidence, outlet
confidence, noise, recommended arrival, parking note. Example "Best overall:
Communal Coffee — good work score, reliable seating before 10 AM, moderate
noise." Actions: View Detail, Save, Directions.

## Date Plan

Inputs: area, time, budget, mood (Cozy, Aesthetic, Quiet, Fun, Outdoor).
CTA "Create Date Plan". Subtle romantic energy; no cheesy hearts.

**Results** (example "Casual La Jolla Coffee Date"): café suggestion, optional
dessert/walking stop, best time, vibe summary. Actions: Save Plan, Share,
Start Navigation.

## Check-In / Vibe Report

Post-visit feedback in under 20 seconds: noise (Quiet/Medium/Loud),
work-friendly (Bad/Okay/Great), Wi-Fi (Unknown/Good/Bad), photo vibe (Not
really/Nice/Very aesthetic), crowd (Empty/Comfortable/Crowded). CTA "Submit
Vibe Report". Fast, tactile, delightful.

## Add Vibe Clip

Upload photo or short video + vibe tags (Cozy, Bright, Quiet, Crowded,
Laptop-friendly, Outdoor, Date spot) + optional note. CTA "Post Vibe Clip".
Photo-first, minimal friction — not a heavy social posting flow.

## Contract Notes

- Check-ins and vibe clips are the community data source feeding vibe scores
  and confidence indicators in `discovery.md` / `cafe-detail.md`.
- User-generated media implies storage + moderation concerns at implementation
  (external systems + data model flags).
