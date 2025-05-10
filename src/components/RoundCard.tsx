import React, { useMemo, useState } from "react";
import { RoundModel } from "../Round/Round";
import { useSwipeable } from "react-swipeable";

interface RoundCardProps {
  round: RoundModel;
  showingPercentages: boolean;
  onDelete: () => void;
}

const calculateStats = (holes: RoundModel["holes"]) => {
  const fairwaysHit = holes.filter(
    (hole) => hole.fairwayStatus === "Hit"
  ).length;
  const greensInRegulation = holes.filter(
    (hole) => hole.isGreenInRegulation
  ).length;
  const twoPuttOrLess = holes.filter((hole) => hole.isTwoPuttOrLess).length;
  const totalHoles = holes.length;

  return {
    fairwaysHit,
    greensInRegulation,
    twoPuttOrLess,
    totalHoles,
    holesWithFairways: holes.filter((hole) => hole.par > 3).length,
  };
};

export const RoundCard: React.FC<RoundCardProps> = ({
  round,
  showingPercentages,
  onDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("swiped");
      setShowDetails(true);
    },
    trackMouse: true,
  });

  const stats = useMemo(() => calculateStats(round.holes), [round.holes]);

  return (
    <div className="round-card" {...swipeHandlers}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="primary-text">{round.courseName}</div>
          <div className="secondary-text">
            {round.date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="stat">
            <span className="secondary-text" style={{ fontWeight: "bold" }}>
              score:{" "}
            </span>
            <span className="primary-text">{round.score}</span>
          </div>
          <div className="stat">
            <span className="secondary-text" style={{ fontWeight: "bold" }}>
              Fairways:{" "}
            </span>
            <span className="value primary-text">
              {showingPercentages
                ? `${Math.round(
                    (stats.fairwaysHit / stats.holesWithFairways) * 100
                  )}%`
                : `${stats.fairwaysHit}/${stats.holesWithFairways}`}
            </span>
          </div>
          <div className="stat">
            <span className="secondary-text" style={{ fontWeight: "bold" }}>
              GIR:{" "}
            </span>
            <span className="value primary-text">
              {showingPercentages
                ? `${Math.round(
                    (stats.greensInRegulation / stats.totalHoles) * 100
                  )}%`
                : `${stats.greensInRegulation}/${stats.totalHoles}`}
            </span>
          </div>
          <div className="stat">
            <span className="secondary-text" style={{ fontWeight: "bold" }}>
              2-Putt or Less:{" "}
            </span>
            <span className="value primary-text">
              {showingPercentages
                ? `${Math.round(
                    (stats.twoPuttOrLess / stats.totalHoles) * 100
                  )}%`
                : `${stats.twoPuttOrLess}/${stats.totalHoles}`}
            </span>
          </div>
        </div>
      </div>
      {showDetails && (
        <button
          onClick={onDelete}
          className="delete-button"
          style={{
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
            marginLeft: "8px",
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};
