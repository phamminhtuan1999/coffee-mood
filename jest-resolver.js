"use strict";

// Chains the react-native-worklets jest resolver (skip .native module
// variants so no real native module is required) with the @react-native
// jest-preset resolver that jest-expo configures by default.
const reactNativeResolver = require("@react-native/jest-preset/jest/resolver.js");

module.exports = (request, options) => {
  if (
    options.basedir.includes("react-native-worklets") ||
    request.includes("react-native-worklets")
  ) {
    options = {
      ...options,
      extensions: options.extensions?.filter((ext) => !ext.includes("native")),
    };
  }

  return reactNativeResolver(request, options);
};
