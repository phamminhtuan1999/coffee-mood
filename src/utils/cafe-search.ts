import type { CafeMapPin } from "@/data/map-pins";
import {
  filterSearchResults,
  findSearchResults,
} from "@/data/search-fixtures";
import type { SearchResult } from "@/data/search-fixtures";
import { getCachedLiveCafes } from "@/utils/live-cafes";

// Live search (US-035): ranks the map's real nearby OSM cafes (the US-031
// session cache) so Search returns real places, not the four fixtures. The
// cache is warm once the map home has loaded; on a cold cache (Search opened
// first, or Overpass failed) it falls back to the curated fixtures — the same
// live/fixture split the map (0024) and AI finder (0026) use. No network call
// happens here and no data leaves the device; matching is local.

// Adapt a real map cafe into the SearchResult the result cards + mini-map
// render: real name/meta/score/tags/tone/coordinates, the live "why" line as
// the match reason, and its tags as match keywords.
function pinToSearchResult(pin: CafeMapPin): SearchResult {
  return {
    id: pin.id,
    name: pin.name,
    meta: pin.meta,
    score: pin.score,
    tags: pin.tags,
    reason:
      pin.whyItMatches[0] ?? "Real nearby cafe from the live map.",
    tone: pin.tone,
    latitude: pin.latitude,
    longitude: pin.longitude,
    keywords: pin.tags.map((tag) => tag.toLowerCase()),
  };
}

export function searchCafes(query: string): SearchResult[] {
  const liveCafes = getCachedLiveCafes();

  if (liveCafes.length > 0) {
    return filterSearchResults(liveCafes.map(pinToSearchResult), query);
  }

  return findSearchResults(query);
}
