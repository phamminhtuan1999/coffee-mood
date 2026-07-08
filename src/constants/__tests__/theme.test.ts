import * as fs from "fs";
import * as path from "path";

import {
  Colors,
  Fonts,
  Radius,
  Shadows,
  Sizing,
  Spacing,
  Typography,
  theme,
} from "@/constants/theme";

describe("design token contract (US-001)", () => {
  it("keeps the shape radii from the design handoff", () => {
    expect(theme.radius.bottomSheetTop).toBe(32);
    expect(theme.radius.button).toBe(18);
    expect(theme.radius.card).toBe(24);
    expect(theme.radius.imageCard).toBe(28);
    expect(theme.radius.chip).toBe(999);
    expect(theme.radius.photoPin).toBe(999);
  });

  it("keeps typography sizes from the design handoff", () => {
    expect(theme.typography.chipLabel.fontSize).toBe(13);
    expect(theme.typography.body.fontSize).toBe(16);
    expect(theme.typography.display.fontSize).toBe(36);
    expect(theme.typography.scoreNumber.fontVariant).toContain("tabular-nums");
  });

  it("keeps control sizing tokens at or above the minimum touch target", () => {
    expect(theme.sizing.minimumTouchTarget).toBe(44);
    expect(theme.sizing.compactControl).toBeGreaterThanOrEqual(44);
    expect(theme.sizing.control).toBeGreaterThanOrEqual(44);
    expect(theme.sizing.searchControl).toBeGreaterThanOrEqual(44);
  });

  it("keeps the spacing scale strictly ascending", () => {
    const scale = [
      theme.spacing.xxs,
      theme.spacing.xs,
      theme.spacing.sm,
      theme.spacing.md,
      theme.spacing.screen,
      theme.spacing.lg,
      theme.spacing.xl,
      theme.spacing.xxl,
      theme.spacing.xxxl,
    ];

    for (let i = 1; i < scale.length; i += 1) {
      expect(scale[i]).toBeGreaterThan(scale[i - 1]);
    }
  });

  it("only holds parseable hex or rgba color values", () => {
    const colorPattern = /^(#[0-9A-Fa-f]{6}|rgba?\([\d\s.,]+\))$/;
    const invalid: string[] = [];
    const walk = (group: Record<string, unknown>, trail: string) => {
      for (const [key, value] of Object.entries(group)) {
        if (typeof value === "string") {
          if (!colorPattern.test(value)) {
            invalid.push(`${trail}.${key}=${value}`);
          }
        } else {
          walk(value as Record<string, unknown>, `${trail}.${key}`);
        }
      }
    };

    walk(theme.colors, "colors");

    expect(invalid).toEqual([]);
  });

  it("exposes aliases that stay in sync with the theme object", () => {
    expect(Spacing).toBe(theme.spacing);
    expect(Sizing).toBe(theme.sizing);
    expect(Fonts).toBe(theme.fonts.family);
    expect(Typography).toBe(theme.typography);
    expect(Radius).toBe(theme.radius);
    expect(Shadows).toBe(theme.shadows);
    expect(Colors.light.text).toBe(theme.colors.text.espresso900);
    expect(Colors.light.background).toBe(theme.colors.background.cream50);
    expect(Colors.light.tint).toBe(theme.colors.brand.roastedBrown);
  });
});

describe("token source integrity", () => {
  it("keeps hard-coded colors out of src outside the theme", () => {
    const srcRoot = path.resolve(__dirname, "..", "..");
    const themeFile = path.join(srcRoot, "constants", "theme.ts");
    const colorLiteral = /#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?\b|rgba?\(/;
    const offenders: string[] = [];

    const visit = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name !== "__tests__" && entry.name !== "test") {
            visit(fullPath);
          }
          continue;
        }

        if (!/\.(ts|tsx)$/.test(entry.name) || fullPath === themeFile) {
          continue;
        }

        const source = fs.readFileSync(fullPath, "utf8");

        if (colorLiteral.test(source)) {
          offenders.push(path.relative(srcRoot, fullPath));
        }
      }
    };

    visit(srcRoot);

    expect(offenders).toEqual([]);
  });
});
