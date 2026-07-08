import "expo-sqlite/localStorage/install";

import {
  DISTANCE_MAX,
  DISTANCE_MIN,
  defaultMapFilters,
  isFilterNeed,
  isFilterTreat,
} from "@/utils/map-filters";
import type { MapFilters } from "@/utils/map-filters";

const MAP_FILTERS_KEY = "cafemood.map-filters.v1";

let cached: MapFilters | null = null;
const listeners = new Set<() => void>();

export function getMapFilters(): MapFilters {
  if (!cached) {
    cached = loadMapFilters();
  }

  return cached;
}

export function setMapFilters(next: MapFilters): void {
  cached = next;
  localStorage.setItem(MAP_FILTERS_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function resetMapFilters(): void {
  setMapFilters(defaultMapFilters());
}

export function subscribeMapFilters(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function clampNumber(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

function loadMapFilters(): MapFilters {
  const stored = localStorage.getItem(MAP_FILTERS_KEY);
  const defaults = defaultMapFilters();

  if (!stored) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<MapFilters>;

    return {
      distance: clampNumber(parsed.distance, DISTANCE_MIN, DISTANCE_MAX, defaults.distance),
      needs: Array.isArray(parsed.needs) ? parsed.needs.filter(isFilterNeed) : [],
      aesthetic: clampNumber(parsed.aesthetic, 0, 10, defaults.aesthetic),
      work: clampNumber(parsed.work, 0, 10, defaults.work),
      noise: clampNumber(parsed.noise, 0, 10, defaults.noise),
      price:
        parsed.price === "$" || parsed.price === "$$" || parsed.price === "$$$"
          ? parsed.price
          : null,
      treats: Array.isArray(parsed.treats) ? parsed.treats.filter(isFilterTreat) : [],
    };
  } catch {
    localStorage.removeItem(MAP_FILTERS_KEY);
    return defaults;
  }
}
