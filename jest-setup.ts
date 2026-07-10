import "react-native-gesture-handler/jestSetup";
import { setUpTests } from "react-native-reanimated";

setUpTests();

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default,
);

// react-native-maps ships untranspiled native components with no jest-expo
// stub; render View-based stands-ins so the map home suite stays green.
jest.mock("react-native-maps", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View } = require("react-native");

  const MapView = React.forwardRef(
    (props: { children?: unknown }, ref: unknown) => {
      React.useImperativeHandle(ref, () => ({
        animateToRegion: jest.fn(),
      }));

      return React.createElement(View, { ...props, testID: "map-view" });
    },
  );
  MapView.displayName = "MockMapView";

  const Marker = (props: { children?: unknown }) =>
    React.createElement(View, props);

  return {
    __esModule: true,
    default: MapView,
    Marker,
    PROVIDER_DEFAULT: undefined,
  };
});

// The expo-sqlite localStorage polyfill can't open a database under jest
// (see jest.moduleNameMapper stub); provide an in-memory localStorage so the
// persisted stores (map filters, saved cafes, taste profile) run in tests.
const memoryLocalStorage = (() => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: memoryLocalStorage,
});
