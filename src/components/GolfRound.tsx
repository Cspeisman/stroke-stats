import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import type { HoleModel, RoundModel } from "../Round/Round";
import "./GolfRound.css";
import { HoleInputs } from "./HoleInputs";
import { RoundSummary } from "./RoundSummary";

export type FairwayStatuses = "Hit" | "Missed" | "-";

function RoundSummaryBar({ holes }: { holes: HoleModel[] }) {
  const totalScore = holes.reduce((sum, hole) => sum + hole.strokes, 0);
  const fairwaysHit = holes.filter(
    (hole) => hole.fairwayStatus === "Hit"
  ).length;
  const greensInRegulation = holes.filter(
    (hole) => hole.isGreenInRegulation
  ).length;
  const twoPuttOrLess = holes.filter((hole) => hole.isTwoPuttOrLess).length;

  return (
    <div className="round-summary-bar">
      <div className="summary-item">
        <span className="label">Score:</span>
        <span className="value">{totalScore}</span>
      </div>
      <div className="summary-item">
        <span className="label">Fairways:</span>
        <span className="value">
          {fairwaysHit}/{holes.length}
        </span>
      </div>
      <div className="summary-item">
        <span className="label">GIR:</span>
        <span className="value">
          {greensInRegulation}/{holes.length}
        </span>
      </div>
      <div className="summary-item">
        <span className="label">2-Putt or Less:</span>
        <span className="value">
          {twoPuttOrLess}/{holes.length}
        </span>
      </div>
    </div>
  );
}

export function GolfRound({ round }: { round: RoundModel }) {
  const [currentHole, setCurrentHole] = useState(round.holes.length + 1);
  const [holes, setHoles] = useState<HoleModel[]>(round.holes);
  const [currentHoleScore, setCurrentHoleScore] = useState<number>(0);
  const [fairwayStatus, setFairwayStatus] = useState<FairwayStatuses>("Missed");
  const [isTwoPuttOrLess, setIsTwoPuttOrLess] = useState(false);
  const [isGreenInRegulation, setIsGreenInRegulation] = useState(false);
  const [currentPar, setCurrentPar] = useState<number>(4);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showEndRoundDialog, setShowEndRoundDialog] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleHitFairway = () => {
    setFairwayStatus((prev) => (prev === "Hit" ? "Missed" : "Hit"));
  };

  const handleTwoPuttOrLess = () => {
    setIsTwoPuttOrLess((prev) => !prev);
  };

  const handleGreenInRegulation = () => {
    setIsGreenInRegulation((prev) => !prev);
  };

  const handleHoleScoreChange = (score: number) => {
    setCurrentHoleScore(score);
    saveCurrentHoleData(score);
    if (currentHole < 18) {
      advanceToNextHole();
    } else {
      saveRoundData();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEndRound = () => {
    handleMenuClose();
    setShowEndRoundDialog(true);
  };

  const handleConfirmEndRound = () => {
    setShowEndRoundDialog(false);
    saveRoundData();
  };

  const handleCancelEndRound = () => {
    setShowEndRoundDialog(false);
  };

  const saveRoundData = async () => {
    try {
      const response = await fetch("/api/end-round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to end round");
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error ending round:", error);
    }
  };

  const saveCurrentHoleData = async (score: number) => {
    setHoles((prev) => {
      const updatedHoles = [...prev];
      updatedHoles[currentHole - 1] = {
        hole: currentHole,
        strokes: score,
        fairwayStatus,
        isTwoPuttOrLess,
        isGreenInRegulation,
        par: currentPar,
      };
      return updatedHoles;
    });

    try {
      const response = await fetch("/api/stroke-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hole: currentHole,
          par: currentPar,
          strokes: score,
          hitFairway:
            fairwayStatus === "Hit"
              ? true
              : fairwayStatus === "Missed"
              ? false
              : null,
          twoPuttOrLess: isTwoPuttOrLess,
          greenInRegulation: isGreenInRegulation,
          roundId: round.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save stroke stats");
      }
    } catch (error) {
      console.error("Error saving stroke stats:", error);
    }
  };

  const advanceToNextHole = () => {
    setCurrentHole((prev) => prev + 1);
    const targetHole = currentHole + 1;
    const existingHole = holes.find((h) => h.hole === targetHole);

    if (existingHole) {
      setCurrentHoleScore(existingHole.strokes);
      setFairwayStatus(existingHole.fairwayStatus);
      setIsTwoPuttOrLess(existingHole.isTwoPuttOrLess);
      setIsGreenInRegulation(existingHole.isGreenInRegulation);
      setCurrentPar(existingHole.par);
    } else {
      setCurrentHoleScore(0);
      setFairwayStatus("Missed");
      setIsTwoPuttOrLess(false);
      setIsGreenInRegulation(false);
      setCurrentPar(4);
    }
  };

  const handlePreviousHole = () => {
    if (currentHole > 1) {
      setCurrentHole((prev) => prev - 1);
      const targetHole = currentHole - 1;
      const existingHole = holes.find((h) => h.hole === targetHole);

      if (existingHole) {
        setCurrentHoleScore(existingHole.strokes);
        setFairwayStatus(existingHole.fairwayStatus);
        setIsTwoPuttOrLess(existingHole.isTwoPuttOrLess);
        setIsGreenInRegulation(existingHole.isGreenInRegulation);
        setCurrentPar(existingHole.par);
      } else {
        setCurrentHoleScore(0);
        setFairwayStatus("Missed");
        setIsTwoPuttOrLess(false);
        setIsGreenInRegulation(false);
        setCurrentPar(4);
      }
    }
  };

  return (
    <div className="golf-round">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "center",
        }}
      >
        <div>
          Course: <strong>{round.courseName}</strong>
        </div>
        <div style={{ justifySelf: "end" }}>
          <IconButton onClick={handleMenuOpen} size="small">
            <MoreHorizIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEndRound}>End Round</MenuItem>
          </Menu>
        </div>
      </div>
      <div className="round-header">
        <RoundSummaryBar holes={holes} />
      </div>
      <div className="hole-navigation">
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={handlePreviousHole}
          disabled={currentHole === 1}
        >
          <ArrowBackIosIcon
            color={currentHole === 1 ? "disabled" : "action"}
            fontSize="large"
          />
        </IconButton>
        <h2>Hole {currentHole}</h2>
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={advanceToNextHole}
          disabled={currentHole === 18}
        >
          <ArrowForwardIosIcon color="action" fontSize="large" />
        </IconButton>
      </div>

      {currentTab === 0 && (
        <>
          <div className="par-selection">
            <button
              className={currentPar === 3 ? "selected" : ""}
              onClick={() => {
                setCurrentPar(3);
                setFairwayStatus("-");
              }}
            >
              Par 3
            </button>
            <button
              className={currentPar === 4 ? "selected" : ""}
              onClick={() => setCurrentPar(4)}
            >
              Par 4
            </button>
            <button
              className={currentPar === 5 ? "selected" : ""}
              onClick={() => setCurrentPar(5)}
            >
              Par 5
            </button>
          </div>

          <HoleInputs
            currentHole={currentHole}
            currentHoleScore={currentHoleScore}
            fairwayStatus={fairwayStatus}
            isTwoPuttOrLess={isTwoPuttOrLess}
            isGreenInRegulation={isGreenInRegulation}
            onHoleScoreChange={handleHoleScoreChange}
            onHitFairway={handleHitFairway}
            onTwoPuttOrLess={handleTwoPuttOrLess}
            onGreenInRegulation={handleGreenInRegulation}
            isParThree={currentPar === 3}
          />
        </>
      )}

      {currentTab === 1 && (
        <RoundSummary holes={holes} currentHole={currentHole} />
      )}

      <Box
        className="tab-selector"
        sx={{ borderTop: 1, borderColor: "divider", mt: 2 }}
      >
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Current Hole" />
          <Tab label="Round Summary" />
        </Tabs>
      </Box>

      <Dialog
        open={showEndRoundDialog}
        onClose={handleCancelEndRound}
        aria-labelledby="end-round-dialog-title"
      >
        <DialogTitle id="end-round-dialog-title">End Round</DialogTitle>
        <DialogContent>
          Are you sure you want to end your round? You haven't finished all 18
          holes.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEndRound} color="primary">
            No
          </Button>
          <Button
            onClick={handleConfirmEndRound}
            color="primary"
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
