import './RoundSummary.css'
import type { HoleData } from './GolfRound';

interface RoundSummaryProps {
    holes: HoleData[];
    currentHole: number;
}

export function RoundSummary({ holes, currentHole }: RoundSummaryProps) {
    const totals = holes.reduce((acc, hole) => ({
        totalScore: acc.totalScore + hole.score,
        fairwaysHit: acc.fairwaysHit + (hole.fairwayStatus === 'Hit' ? 1 : 0),
        twoPuttsOrLess: acc.twoPuttsOrLess + (hole.isTwoPuttOrLess ? 1 : 0),
        greensInRegulation: acc.greensInRegulation + (hole.isGreenInRegulation ? 1 : 0)
    }), {
        totalScore: 0,
        fairwaysHit: 0,
        twoPuttsOrLess: 0,
        greensInRegulation: 0
    });

    // Create an array of all 18 holes, filling in empty data for holes not yet played
    const allHoles = Array.from({ length: 18 }, (_, index) => {
        const holeNumber = index + 1;
        const existingHole = holes.find(h => h.hole === holeNumber);
        return existingHole || {
            hole: holeNumber,
            score: 0,
            fairwayStatus: "-" as const,
            isTwoPuttOrLess: false,
            isGreenInRegulation: false,
            par: 4
        };
    });

    return (
        <div className="round-summary" data-testid="round-summary">
            <div className="summary-stats" data-testid="summary-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Score:</span>
                    <span className="stat-value">{totals.totalScore}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div className="stat-item">
                        <span className="stat-label">Fairways Hit:</span>
                        <span className="stat-value">{totals.fairwaysHit}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Two Putts or Less:</span>
                        <span className="stat-value">{totals.twoPuttsOrLess}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">GIR</span>
                        <span className="stat-value">{totals.greensInRegulation}</span>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Hole</th>
                        <th>Score</th>
                        <th>Fairway</th>
                        <th>Two Putt or Less</th>
                        <th>Green in Regulation</th>
                    </tr>
                </thead>
                <tbody>
                    {allHoles.map((hole) => (
                        <tr
                            key={hole.hole}
                            className={hole.hole === currentHole ? 'current-hole' : ''}
                            data-testid={hole.hole === currentHole ? 'current-hole-row' : undefined}
                        >
                            <td>{hole.hole}</td>
                            <td>{hole.score || '-'}</td>
                            <td>{hole.fairwayStatus}</td>
                            <td>{hole.isTwoPuttOrLess ? 'Yes' : 'No'}</td>
                            <td>{hole.isGreenInRegulation ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
} 