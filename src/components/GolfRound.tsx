import { useState, useEffect } from "react";
import { Tabs, Tab, Box, IconButton } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./GolfRound.css";
import { RoundSummary } from "./RoundSummary";
import { HoleInputs } from "./HoleInputs";

export type FairwayStatuses = "Hit" | "Missed" | "-";

export interface HoleData {
  hole: number;
  score: number;
  fairwayStatus: FairwayStatuses;
  isTwoPuttOrLess: boolean;
  isGreenInRegulation: boolean;
  par: number;
}

export function GolfRound() {
  const [currentHole, setCurrentHole] = useState(1);
  const [holes, setHoles] = useState<HoleData[]>([]);
  const [currentHoleScore, setCurrentHoleScore] = useState<number>(0);
  const [fairwayStatus, setFairwayStatus] = useState<FairwayStatuses>("Missed");
  const [isTwoPuttOrLess, setIsTwoPuttOrLess] = useState(false);
  const [isGreenInRegulation, setIsGreenInRegulation] = useState(false);
  const [currentPar, setCurrentPar] = useState<number>(4);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const loadHoleData = async () => {
      try {
        const response = await fetch('/api/stroke-stats');
        if (!response.ok) {
          throw new Error('Failed to load stroke stats');
        }
        const data = await response.json();

        // Transform the API data into HoleData format
        const loadedHoles = data.map((item: any) => ({
          hole: item.hole,
          score: item.strokes,
          fairwayStatus: item.hitFairway === true ? "Hit" : item.hitFairway === false ? "Missed" : "-",
          isTwoPuttOrLess: item.twoPuttOrLess,
          isGreenInRegulation: item.greenInRegulation,
          par: item.par,
        }));

        setHoles(loadedHoles);

        // If there's data, set the current hole to the last hole with data
        if (loadedHoles.length > 0) {
          const lastHole = loadedHoles[loadedHoles.length - 1];
          setCurrentHole(lastHole.hole);
          setCurrentHoleScore(lastHole.score);
          setFairwayStatus(lastHole.fairwayStatus);
          setIsTwoPuttOrLess(lastHole.isTwoPuttOrLess);
          setIsGreenInRegulation(lastHole.isGreenInRegulation);
          setCurrentPar(lastHole.par);
        }
      } catch (error) {
        console.error('Error loading stroke stats:', error);
      }
    };

    loadHoleData();
  }, []);

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
    }
  };

  const saveCurrentHoleData = async (score: number) => {
    setHoles((prev) => {
      const updatedHoles = [...prev];
      updatedHoles[currentHole - 1] = {
        hole: currentHole,
        score,
        fairwayStatus,
        isTwoPuttOrLess,
        isGreenInRegulation,
        par: currentPar,
      };
      return updatedHoles;
    });

    try {
      const response = await fetch('/api/stroke-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hole: currentHole,
          par: currentPar,
          strokes: score,
          hitFairway: fairwayStatus === "Hit" ? true : fairwayStatus === "Missed" ? false : null,
          twoPuttOrLess: isTwoPuttOrLess,
          greenInRegulation: isGreenInRegulation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save stroke stats');
      }
    } catch (error) {
      console.error('Error saving stroke stats:', error);
    }
  };

  const advanceToNextHole = () => {
    setCurrentHole((prev) => prev + 1);
    const targetHole = currentHole + 1;
    const existingHole = holes.find((h) => h.hole === targetHole);

    if (existingHole) {
      setCurrentHoleScore(existingHole.score);
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
        setCurrentHoleScore(existingHole.score);
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
      <div className="hole-navigation">
        <IconButton
          style={{ backgroundColor: 'transparent' }}
          onClick={handlePreviousHole}
          disabled={currentHole === 1}
        >
          <ArrowBackIosIcon color={currentHole === 1 ? "disabled" : "action"} fontSize="large" />
        </IconButton>
        <h2>Hole {currentHole}</h2>
        <IconButton
          style={{ backgroundColor: 'transparent' }}
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

      <Box className="tab-selector" sx={{ borderTop: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={currentTab} onChange={handleTabChange} centered>
          <Tab label="Current Hole" />
          <Tab label="Round Summary" />
        </Tabs>
      </Box>
    </div>
  );
}
