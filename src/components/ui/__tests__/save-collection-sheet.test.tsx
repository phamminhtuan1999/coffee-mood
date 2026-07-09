import { fireEvent, render, screen } from "@testing-library/react-native";

import {
  SaveCollectionSheet,
  type SaveCollectionOption,
} from "@/components/ui";

const collections: SaveCollectionOption[] = [
  { id: "want-to-try", name: "Want to Try", tone: "terracotta", count: 3 },
  { id: "work-spots", name: "Work Spots", tone: "olive", count: 1 },
];

async function renderSheet(
  overrides: Partial<Parameters<typeof SaveCollectionSheet>[0]> = {},
) {
  const props = {
    cafeName: "Mostra Coffee",
    collections,
    selectedIds: [] as string[],
    note: "",
    onToggleCollection: jest.fn(),
    onChangeNote: jest.fn(),
    onCreateNew: jest.fn(),
    onCancel: jest.fn(),
    onSave: jest.fn(),
    ...overrides,
  };

  await render(<SaveCollectionSheet {...props} />);

  return props;
}

describe("SaveCollectionSheet", () => {
  it("renders the cafe name, collections, and their counts", async () => {
    await renderSheet();

    expect(screen.getByText("Save Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("Want to Try")).toBeTruthy();
    expect(screen.getByText("3 saved")).toBeTruthy();
    expect(screen.getByText("Work Spots")).toBeTruthy();
  });

  it("reflects selected collections as selected buttons", async () => {
    await renderSheet({ selectedIds: ["want-to-try"] });

    expect(
      screen.getByRole("button", {
        name: "Want to Try, 3 saved",
        selected: true,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Work Spots, 1 saved",
        selected: false,
      }),
    ).toBeTruthy();
  });

  it("toggles a collection when tapped", async () => {
    const props = await renderSheet();

    await fireEvent.press(screen.getByLabelText("Want to Try, 3 saved"));

    expect(props.onToggleCollection).toHaveBeenCalledWith("want-to-try");
  });

  it("edits the private note", async () => {
    const props = await renderSheet();

    await fireEvent.changeText(
      screen.getByLabelText("Private note"),
      "Try the horchata latte",
    );

    expect(props.onChangeNote).toHaveBeenCalledWith("Try the horchata latte");
  });

  it("opens create-new, saves, and cancels through their callbacks", async () => {
    const props = await renderSheet();

    await fireEvent.press(screen.getByLabelText("Create new collection"));
    expect(props.onCreateNew).toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText("Save cafe to collections"));
    expect(props.onSave).toHaveBeenCalled();

    await fireEvent.press(screen.getByText("Cancel"));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it("cancels when the backdrop is dismissed", async () => {
    const props = await renderSheet();

    await fireEvent.press(screen.getByLabelText("Dismiss save sheet"));

    expect(props.onCancel).toHaveBeenCalled();
  });
});
