import { StyleSheet } from "react-native";

type RenderedNode =
  | {
      props?: { style?: unknown };
      children?: (RenderedNode | string)[] | null;
    }
  | string
  | null;

type FlatStyle = Record<string, unknown>;

export function collectStyles(node: RenderedNode | undefined): FlatStyle[] {
  if (!node || typeof node !== "object") {
    return [];
  }

  const own = node.props?.style
    ? [StyleSheet.flatten(node.props.style as never) as FlatStyle]
    : [];
  const children = Array.isArray(node.children) ? node.children : [];

  return own.concat(children.flatMap((child) => collectStyles(child)));
}

export function findStyleWith(
  node: RenderedNode | undefined,
  expected: FlatStyle,
): FlatStyle | undefined {
  const entries = Object.entries(expected);

  return collectStyles(node).find((style) =>
    entries.every(([key, value]) => style[key] === value),
  );
}
