# Design System — "Ambient Editorial Map"

Visual contract for all CafeMood Map screens. Source of truth for tokens used
by the app theme (`src/constants/theme.ts` extends from this when E01 lands).

Brand keywords: warm, editorial, map-first, aesthetic, local discovery, cozy,
premium, human-made, tactile, calm.

## Color Tokens

Background:

| Token | Value |
| --- | --- |
| Cream 50 | `#FAF7F0` |
| Cream 100 | `#F3EDE2` |
| Warm Paper | `#EFE6D8` |

Text:

| Token | Value |
| --- | --- |
| Espresso 900 | `#241A14` |
| Espresso 700 | `#4A352A` |
| Muted Text | `#7B6A5E` |

Brand:

| Token | Value |
| --- | --- |
| Roasted Brown | `#8A5A3C` |
| Latte Beige | `#D8BFA5` |
| Olive Matcha | `#7D8B64` |
| Terracotta | `#C97955` |

Surface:

| Token | Value |
| --- | --- |
| Card Cream | `rgba(255, 252, 246, 0.88)` |
| Glass Cream | `rgba(250, 247, 240, 0.72)` |
| Border Soft | `rgba(36, 26, 20, 0.08)` |

Score:

| Token | Value |
| --- | --- |
| Great | `#6F8B5E` |
| Good | `#B88A44` |
| Crowded | `#C76E4F` |

## Typography

Two personalities: clean sans-serif for UI (SF Pro / Inter / Geist Sans),
editorial serif for café names and hero titles (New York / Playfair Display /
Cormorant Garamond).

| Style | Spec |
| --- | --- |
| Display / Hero | 36px serif medium |
| Title / Café Name | 28px serif medium |
| Section Title | 20px sans semibold |
| Body | 16px sans regular |
| Body Small | 14px sans regular |
| Caption | 12px sans medium |
| Score Number | 28px sans semibold |
| Chip Label | 13px sans medium |

## Spacing

Scale: 4, 8, 12, 16, 20, 24, 32, 40, 56. Mobile horizontal padding: 20px.
Card internal padding: 16px or 20px. 8-point grid; respect iOS safe areas.

## Radius

| Element | Radius |
| --- | --- |
| Chip | 999px |
| Button | 18px |
| Card | 24px |
| Image Card | 28px |
| Bottom Sheet | 32px top |
| Photo Pin | circle |

## Shadows

| Token | Value |
| --- | --- |
| Card Shadow | `0 16 40 rgba(36, 26, 20, 0.14)` |
| Pin Shadow | `0 8 22 rgba(36, 26, 20, 0.20)` |
| Button Shadow | `0 6 16 rgba(36, 26, 20, 0.10)` |

## Map Style

Warm desaturated map: beige roads, muted olive parks, soft dusty water,
minimal POI noise. Never default Google Maps colors.

## Core Components

Primary Button, Secondary Button, Icon Button, Vibe Chip, Search Bar,
Photo Map Pin, Clustered Photo Pin, Café Preview Bottom Sheet, Score Badge,
AI Summary Card, Café Image Card, Route Stop Card, Collection Card,
Empty State Card, Loading Skeleton, Filter Row, Preference Chip, Save Button,
Share Button, Navigation Bar, Bottom Tab Bar.

Component rules: clear naming, useful variants, consistent padding, proper
radius and token usage, no one-off colors, no duplicated styles.
