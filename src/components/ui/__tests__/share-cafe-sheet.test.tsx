import { fireEvent, render, screen } from "@testing-library/react-native";

import { ShareCafeCard, ShareCafeSheet } from "@/components/ui";
import { getShareCardContent } from "@/data/share-card";

const content = getShareCardContent("mostra")!;

describe("ShareCafeCard", () => {
  it("renders the cafe name, location, vibe tag, score, tagline, and brand", async () => {
    await render(<ShareCafeCard content={content} />);

    expect(screen.getByLabelText("Share card for Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("Mostra Coffee")).toBeTruthy();
    expect(screen.getByText("North Park · San Diego")).toBeTruthy();
    expect(screen.getByText("Aesthetic")).toBeTruthy();
    expect(screen.getByText("9.1")).toBeTruthy();
    expect(
      screen.getByText(
        "Warm light, strong lattes — made for slow photo mornings.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("CafeMood Map")).toBeTruthy();
  });
});

describe("ShareCafeSheet", () => {
  it("renders the heading, the card, and the three actions", async () => {
    const onAction = jest.fn();
    const onClose = jest.fn();

    await render(
      <ShareCafeSheet
        content={content}
        onAction={onAction}
        onClose={onClose}
      />,
    );

    expect(screen.getByText("Share this cafe")).toBeTruthy();
    expect(screen.getByLabelText("Share card for Mostra Coffee")).toBeTruthy();

    for (const label of ["Copy Link", "Share Image", "Send to Friend"]) {
      expect(screen.getByLabelText(label)).toBeTruthy();
    }
  });

  it("reports which action was tapped", async () => {
    const onAction = jest.fn();

    await render(
      <ShareCafeSheet
        content={content}
        onAction={onAction}
        onClose={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Copy Link"));

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "copy", label: "Copy Link" }),
    );
  });

  it("closes from the backdrop", async () => {
    const onClose = jest.fn();

    await render(
      <ShareCafeSheet
        content={content}
        onAction={jest.fn()}
        onClose={onClose}
      />,
    );

    await fireEvent.press(screen.getByLabelText("Dismiss share sheet"));

    expect(onClose).toHaveBeenCalled();
  });
});
