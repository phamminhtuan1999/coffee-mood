// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    // docs/design holds extracted design-handoff prototypes (raw by design);
    // they are visual contracts, not app code.
    ignores: ["dist/*", "docs/design/**"],
  }
]);
