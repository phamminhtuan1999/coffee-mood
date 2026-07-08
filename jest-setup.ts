import "react-native-gesture-handler/jestSetup";
import { setUpTests } from "react-native-reanimated";

setUpTests();

jest.mock("react-native-safe-area-context", () =>
  require("react-native-safe-area-context/jest/mock").default,
);
