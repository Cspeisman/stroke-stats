import React, { useMemo, useState } from "react";
import { RoundModel } from "../Round/Round";
import { useSwipeable } from "react-swipeable";
import ConfirmationButton from "./ConfirmationButton";

interface RoundCardProps {
  round: RoundModel;
  showingPercentages: boolean;
  onDelete: () => void;
  onEdit: () => void;
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
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const SWIPE_THRESHOLD = 0.5; // 50% of the way to trigger the delete button
  const swipeHandlers = useSwipeable({
    onSwiping: (eventData) => {
      setIsSwiping(true);
      let progress = 0;
      if (eventData.dir === "Right") {
        progress = (200 - eventData.deltaX) / 200;
      } else {
        progress = Math.min(Math.max(-eventData.deltaX / 200, 0), 1);
      }

      setSwipeProgress(progress);
    },
    onSwiped: (eventData) => {
      setIsSwiping(false);
      const swipeDistance = Math.abs(eventData.deltaX) / 200;

      if (eventData.dir === "Left" && swipeDistance >= SWIPE_THRESHOLD) {
        setSwipeProgress(1);
      } else if (
        eventData.dir === "Right" &&
        swipeDistance >= SWIPE_THRESHOLD
      ) {
        setSwipeProgress(0);
      } else {
        setSwipeProgress(0);
      }
    },
    trackMouse: true,
    delta: 5,
    preventScrollOnSwipe: true,
  });

  const stats = useMemo(() => calculateStats(round.holes), [round.holes]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        position: "relative",
        marginBottom: "0.5rem",
      }}
    >
      <div
        className="round-card"
        {...swipeHandlers}
        style={{
          transform: `translateX(${swipeProgress * -180}px)`,
          transition: isSwiping
            ? "none"
            : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          willChange: "transform",
        }}
      >
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
      </div>

      <div
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          gap: "8px",
          height: "100%",
        }}
      >
        <button
          onClick={() => {}}
          className="edit-button"
          style={{
            backgroundColor: "var(--secondary-text-color)",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: `${swipeProgress * 80}px`,
            transition: isSwiping
              ? "none"
              : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: swipeProgress,
            willChange: "width, opacity",
            height: "100%",
          }}
        >
          Edit
        </button>
        <ConfirmationButton
          onConfirm={onDelete}
          buttonText="Delete"
          confirmationText="Are you sure you want to delete this round?"
          buttonStyle={{
            backgroundColor: "#ff4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            width: `${swipeProgress * 80}px`,
            transition: isSwiping
              ? "none"
              : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            opacity: swipeProgress,
            willChange: "width, opacity",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
};
