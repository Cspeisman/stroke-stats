import { FormControlLabel, MenuItem, Select, Switch } from "@mui/material";
import "./HoleInputs.css";
import type { FairwayStatuses } from "./GolfRound";

interface HoleInputsProps {
  currentHole: number;
  currentHoleScore: number;
  fairwayStatus: FairwayStatuses;
  isTwoPuttOrLess: boolean;
  isGreenInRegulation: boolean;
  onHoleScoreChange: (score: number) => void;
  onHitFairway: () => void;
  onTwoPuttOrLess: () => void;
  onGreenInRegulation: () => void;
  isParThree?: boolean;
}

export function HoleInputs({
  currentHole,
  currentHoleScore,
  fairwayStatus: tempFairwayStatus,
  isTwoPuttOrLess: tempIsTwoPuttOrLess,
  isGreenInRegulation: tempIsGreenInRegulation,
  onHoleScoreChange,
  onHitFairway,
  onTwoPuttOrLess,
  onGreenInRegulation,
  isParThree: disabled = false,
}: HoleInputsProps) {
  return (
    <div>
      <div className="stats-grid">
        <FormControlLabel
          className="field"
          control={
            <Switch
              checked={tempFairwayStatus === "Hit"}
              onChange={onHitFairway}
              disabled={disabled}
            />
          }
          label="Hit Fairway"
          labelPlacement="start"
        />
        <FormControlLabel
          className="field"
          control={
            <Switch checked={tempIsTwoPuttOrLess} onChange={onTwoPuttOrLess} />
          }
          label="Two Putt or Less"
          labelPlacement="start"
        />
        <FormControlLabel
          className="field"
          control={
            <Switch
              checked={tempIsGreenInRegulation}
              onChange={onGreenInRegulation}
            />
          }
          label="Green in Regulation"
          labelPlacement="start"
        />
        <FormControlLabel
          className="field"
          control={
            <Select
              value={currentHoleScore}
              onChange={(e) => onHoleScoreChange(e.target.value as number)}
              variant="outlined"
              sx={{ minWidth: 80 }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((score) => (
                <MenuItem key={score} value={score}>
                  {score}
                </MenuItem>
              ))}
            </Select>
          }
          label={`Score for Hole #${currentHole}`}
          labelPlacement="start"
        />
      </div>
    </div>
  );
}
