# Onboarding and Auth

First-time user experience before the main map. Must communicate "premium
visual café discovery" immediately; never corporate onboarding.

## Flow

```text
Splash -> Welcome -> Feature Intro -> Auth -> Location Primer -> Taste Onboarding -> Main Map
Welcome -> Explore as Guest -> Location Primer
Auth -> Continue as Guest -> Location Primer
Location Primer -> Choose Manually -> Manual Location Search -> Taste Onboarding
```

## Screens

1. **Splash** — logo, tagline "Find cafés by vibe.", warm map texture, soft
   logo reveal. Calm, editorial, not food-delivery style.
2. **Welcome** — hero "Find a café that fits your mood." / subtitle "Discover
   beautiful coffee shops nearby for work, dates, photos, or slow mornings."
   Primary "Get Started", secondary "Explore as Guest". Hero collage: café
   photo + map preview + photo pins + vibe chips (Pinterest x Google Maps x
   lifestyle magazine).
3. **Feature Intro Carousel** — 3 slides: "Explore visually" (map with photo
   pins), "Match your mood" (vibe chips + café cards), "Save your coffee map"
   (collection grid). Page indicator, Skip, Continue. Short.
4. **Authentication** — Continue with Apple / Google / Email / **as Guest**.
   Guest mode must be visible; discovery apps must not force signup early.
5. **Email Sign In / Sign Up** — email + password, Continue, Forgot password,
   create/sign-in toggle, soft card layout, include an error state.
6. **Location Permission Primer** — "Find cafés near you" + rationale before
   the system prompt. Buttons: Use Current Location / Choose Manually. Helpful,
   not pushy.
7. **Manual Location Search** — placeholder "Search city or neighborhood",
   examples (San Diego, Mira Mesa, La Jolla, North Park, Convoy), sections:
   Recent locations, Popular neighborhoods, Use current location link.
8. **Taste Onboarding** — builds taste profile. Café type (Work/Study,
   Aesthetic, Date Spot, Quiet, Outdoor, Specialty Coffee); what matters
   (Wi-Fi, Outlets, Parking, Low noise, Good latte, Photo spots); distance
   (5/10/20 min, Anywhere); price ($/$$/$$$). CTA "Build My Café Map". Large
   tactile chips, no overwhelming forms.

## Contract Notes

- Guest browsing is a supported end-to-end path; signup is never a wall before
  the map.
- US-005 implements the app-facing auth/session shell and guest mode. Real
  Supabase Auth token exchange is a future high-risk integration boundary; see
  `docs/decisions/0009-us005-auth-session-boundary.md`.
- Location permission is always primed in-app before the OS dialog.
- Taste profile feeds recommendation ranking (see `discovery.md`).
- Auth provider work is high-risk lane (auth hard gate) — see E02 stories.
