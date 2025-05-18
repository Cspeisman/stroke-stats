import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { GolfRound } from "./GolfRound";
import type { RoundModel, HoleModel } from "../Round/Round";
import React from "react";
import { describe, it, expect } from "vitest";
import { afterEach } from "node:test";

// Helper to create a minimal valid HoleModel
function makeHole(overrides: Partial<HoleModel> = {}): HoleModel {
  return {
    hole: 1,
    strokes: 3,
    fairwayStatus: "Missed", // as FairwayStatuses
    isTwoPuttOrLess: false,
    isGreenInRegulation: false,
    par: 4,
    ...overrides,
  };
}

// Helper to create a minimal valid RoundModel
function makeRound(holes: HoleModel[] = []): RoundModel {
  return {
    id: "test-round",
    userId: "user-1",
    courseName: "Test Course",
    date: new Date(),
    active: true,
    score: 0,
    holes,
  };
}

describe("GolfRound End Round button", () => {
  afterEach(() => {
    console.log("called");
    cleanup();
  });
  it("does not show End Round button if not all holes have strokes", () => {
    const holes = Array.from({ length: 18 }, (_, i) =>
      makeHole({ hole: i + 1, strokes: i < 17 ? 2 : 0 })
    );
    render(<GolfRound round={makeRound(holes)} />);
    expect(screen.queryByText(/End Round/i)).toBeNull();
  });

  it("shows End Round button when all 18 holes have strokes > 0", () => {
    const holes = Array.from({ length: 18 }, (_, i) =>
      makeHole({ hole: i + 1, strokes: 3 })
    );
    render(<GolfRound round={makeRound(holes)} />);
    expect(screen.getByText(/Save Round/i)).toBeTruthy();
  });

  it("opens EndRoundDialog when Save Round button is clicked", () => {
    const holes = Array.from({ length: 18 }, (_, i) =>
      makeHole({ hole: i + 1, strokes: 3 })
    );
    render(<GolfRound round={makeRound(holes)} />);
    fireEvent.click(screen.getByRole("button", { name: /Save Round/i }));
    expect(screen.getByText(/End of round summary/i)).toBeTruthy();
  });
});
