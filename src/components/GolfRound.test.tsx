import { render, screen } from "@testing-library/react";
import { GolfRound } from "./GolfRound";
import { describe, expect, it } from "vitest";
import { HoleModel, RoundModel } from "../Round/Round";
describe('GolfRound', () => {
    it('should render', () => {
        const round = new RoundModel(
            '1',
            'test-user',
            'test-course',
            new Date(),
            true,
            0,
            []
        );
        render(<GolfRound round={round} />);
        screen.getByText('Hole 1');
    });

    it('should start at the next hole', () => {
        const round = new RoundModel(
            '1',
            'test-user',
            'test-course',
            new Date(),
            true,
            0, 
            [new HoleModel(1, 4, "Hit", true, true, 4 )]
        )
        render(<GolfRound round={round} />);
        screen.getByText('Hole 2');
    })
});