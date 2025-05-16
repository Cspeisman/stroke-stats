import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EndRoundDialog } from "./EndRoundDialog";
import type { HoleModel } from "../Round/Round";

describe("EndRoundDialog", () => {
  const baseProps = {
    open: true,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
  };

  it("shows warning when not all holes are complete", () => {
    const holes: HoleModel[] = Array.from({ length: 10 }, (_, i) => ({
      hole: i + 1,
      strokes: 4,
      fairwayStatus: "Hit",
      isTwoPuttOrLess: true,
      isGreenInRegulation: true,
      par: 4,
    }));
    render(<EndRoundDialog {...baseProps} holes={holes} />);
    expect(
      screen.getByText(
        /are you sure you want to end your round\? you haven't finished all 18 holes\./i
      )
    ).toBeTruthy();
  });

  it("shows quick summary when all 18 holes are complete", () => {
    const holes: HoleModel[] = Array.from({ length: 18 }, (_, i) => ({
      hole: i + 1,
      strokes: 4,
      fairwayStatus: i % 2 === 0 ? "Hit" : "Missed",
      isTwoPuttOrLess: i % 3 === 0,
      isGreenInRegulation: i % 4 === 0,
      par: 4,
    }));
    render(<EndRoundDialog {...baseProps} holes={holes} />);
    expect(screen.getByText("End of round summary")).toBeTruthy();
    expect(screen.getByText(/total score: 72/i)).toBeTruthy();
    expect(screen.getByText(/fairways hit: 9\/18/i)).toBeTruthy();
    expect(screen.getByText(/gir: 5\/18/i)).toBeTruthy();
    expect(screen.getByText(/2-putt or less: 6\/18/i)).toBeTruthy();
  });
});
