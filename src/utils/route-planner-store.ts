import {
  DEFAULT_ROUTE_INPUTS,
  clampStopCount,
  stopFromAlternative,
} from "@/data/route-plan";
import type {
  GeneratedRoute,
  RouteAlternative,
  RoutePlannerInputs,
} from "@/data/route-plan";
import { planRoute } from "@/utils/planner-cafes";

// Ephemeral, session-scoped route state shared across the planner -> route
// detail -> replace-stop flow. Unlike map filters or saved cafés, a generated
// route is not a persisted preference, so this store lives in memory only; it
// is not written to localStorage. A future "Save Route" provider (deferred with
// this story) would persist selected routes into the saved library.

export type RoutePlannerState = {
  inputs: RoutePlannerInputs;
  route: GeneratedRoute | null;
};

let cached: RoutePlannerState = {
  inputs: { ...DEFAULT_ROUTE_INPUTS },
  route: null,
};

const listeners = new Set<() => void>();

export function getRoutePlanner(): RoutePlannerState {
  return cached;
}

export function subscribeRoutePlanner(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function commit(next: RoutePlannerState): void {
  cached = next;
  listeners.forEach((listener) => listener());
}

export function setRouteInputs(partial: Partial<RoutePlannerInputs>): void {
  const merged = { ...cached.inputs, ...partial };
  commit({
    ...cached,
    inputs: {
      ...merged,
      stopCount: clampStopCount(merged.stopCount),
    },
  });
}

export function generateActiveRoute(): void {
  commit({ ...cached, route: planRoute(cached.inputs) });
}

// Guarantees a route exists (used by the detail/replace screens so a cold deep
// link still renders), without clobbering an already-generated route.
export function ensureActiveRoute(): void {
  if (!cached.route) {
    generateActiveRoute();
  }
}

export function replaceRouteStop(
  index: number,
  alternative: RouteAlternative,
): void {
  if (!cached.route) {
    return;
  }

  const stops = cached.route.stops.map((stop, position) =>
    position === index
      ? stopFromAlternative(alternative, stop.role)
      : stop,
  );

  commit({ ...cached, route: { ...cached.route, stops } });
}

export function resetRoutePlanner(): void {
  commit({ inputs: { ...DEFAULT_ROUTE_INPUTS }, route: null });
}
