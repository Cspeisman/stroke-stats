import React, { useState } from "react";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { RoundModel } from "../Round/Round";
import "./Rounds.css";
import { Menu, MenuItem, Button } from "@mui/material";

interface RoundsProps {
  rounds: RoundModel[];
}

const Rounds: React.FC<RoundsProps> = ({ rounds }) => {
  const [showingPercentages, setShowingPercentages] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  return (
    <div className="container">
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ fontSize: "1.25rem" }}>All Rounds</div>
        <div
          className="header-actions"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <Button
            href="/new-round"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              fontSize: "0.875rem",
              padding: "4px 12px",
              backgroundColor: "rgba(224, 145, 124, 1)",
              "&:hover": {
                backgroundColor: "rgba(224, 145, 124, 0.9)",
              },
            }}
          >
            New Round
          </Button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem 0",
        }}
      >
        <Button
          onClick={handleClick}
          size="small"
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            color: "#979797",
            textTransform: "none",
            fontSize: "0.875rem",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            padding: "4px 12px",
            "&:hover": {
              borderColor: "#bdbdbd",
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
          aria-haspopup="true"
        >
          Settings
        </Button>
        <Menu
          anchorEl={anchorEl}
          id="settings-menu"
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              setShowingPercentages(!showingPercentages);
              handleClose();
            }}
          >
            {showingPercentages ? "Show Fractions" : "Show Percentages"}
          </MenuItem>
          <MenuItem onClick={handleClose}>Export Data</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Menu>
      </div>

      <div>
        {rounds.map((round, index) => {
          const stats = calculateStats(round.holes);
          return (
            <div key={index} className="round-card">
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
                  <span
                    className="secondary-text"
                    style={{ fontWeight: "bold" }}
                  >
                    score:{" "}
                  </span>
                  <span className="primary-text">{round.score}</span>
                </div>
                <div className="stat">
                  <span
                    className="secondary-text"
                    style={{ fontWeight: "bold" }}
                  >
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
                  <span
                    className="secondary-text"
                    style={{ fontWeight: "bold" }}
                  >
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
                  <span
                    className="secondary-text"
                    style={{ fontWeight: "bold" }}
                  >
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
          );
        })}
      </div>
    </div>
  );
};

export default Rounds;
