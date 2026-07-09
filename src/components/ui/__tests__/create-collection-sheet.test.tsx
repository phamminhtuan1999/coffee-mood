import { fireEvent, render, screen } from "@testing-library/react-native";

import { CreateCollectionSheet } from "@/components/ui";

async function renderSheet(
  overrides: Partial<Parameters<typeof CreateCollectionSheet>[0]> = {},
) {
  const props = {
    name: "",
    description: "",
    privacy: "private" as const,
    onChangeName: jest.fn(),
    onChangeDescription: jest.fn(),
    onPickSuggested: jest.fn(),
    onTogglePrivacy: jest.fn(),
    onCancel: jest.fn(),
    onCreate: jest.fn(),
    ...overrides,
  };

  const utils = await render(<CreateCollectionSheet {...props} />);

  return { props, ...utils };
}

describe("CreateCollectionSheet", () => {
  it("renders the title, prompt, and suggested names", async () => {
    await renderSheet();

    expect(screen.getByText("New collection")).toBeTruthy();
    expect(screen.getByText("Name it after the mood, not the map.")).toBeTruthy();

    for (const name of [
      "Cute Date Cafes",
      "Work Spots",
      "Matcha Places",
      "Weekend Finds",
    ]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
  });

  it("edits name and description", async () => {
    const { props } = await renderSheet();

    await fireEvent.changeText(
      screen.getByLabelText("Collection name"),
      "Rainy Day Reads",
    );
    expect(props.onChangeName).toHaveBeenCalledWith("Rainy Day Reads");

    await fireEvent.changeText(
      screen.getByLabelText("Collection description"),
      "Window light and long tables",
    );
    expect(props.onChangeDescription).toHaveBeenCalledWith(
      "Window light and long tables",
    );
  });

  it("fills the name from a suggested chip", async () => {
    const { props } = await renderSheet();

    await fireEvent.press(
      screen.getByLabelText("Use suggested name Matcha Places"),
    );

    expect(props.onPickSuggested).toHaveBeenCalledWith("Matcha Places");
  });

  it("shows the private privacy copy and toggles it", async () => {
    const { props } = await renderSheet();

    expect(screen.getByText("Private collection")).toBeTruthy();
    expect(screen.getByText("Only you can see this")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Collection privacy"));

    expect(props.onTogglePrivacy).toHaveBeenCalled();
  });

  it("shows the public privacy copy when public", async () => {
    await renderSheet({ privacy: "public" });

    expect(screen.getByText("Public collection")).toBeTruthy();
    expect(screen.getByText("Anyone with the link can view")).toBeTruthy();
  });

  it("disables Create until a name is entered", async () => {
    const { props, rerender } = await renderSheet();

    const createButton = screen.getByLabelText("Create Collection");
    expect(createButton.props.accessibilityState.disabled).toBe(true);

    await fireEvent.press(createButton);
    expect(props.onCreate).not.toHaveBeenCalled();

    await rerender(
      <CreateCollectionSheet
        {...props}
        name="Weekend Finds"
      />,
    );

    const enabledButton = screen.getByLabelText("Create Collection");
    expect(enabledButton.props.accessibilityState.disabled).toBe(false);

    await fireEvent.press(enabledButton);
    expect(props.onCreate).toHaveBeenCalled();
  });

  it("cancels through the backdrop and the Cancel button", async () => {
    const { props } = await renderSheet();

    await fireEvent.press(screen.getByText("Cancel"));
    expect(props.onCancel).toHaveBeenCalledTimes(1);

    await fireEvent.press(
      screen.getByLabelText("Dismiss create collection sheet"),
    );
    expect(props.onCancel).toHaveBeenCalledTimes(2);
  });
});
