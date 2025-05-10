import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import { RoundModel } from "../Round/Round";
import { RoundCard } from "./RoundCard";
import "./Rounds.css";

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

  const handleDelete = async (roundId: string) => {
    try {
      const response = await fetch(`/api/delete-round`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roundId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete round");
      }

      // Refresh the page to show updated rounds
      window.location.reload();
    } catch (error) {
      console.error("Error deleting round:", error);
    }
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
        {rounds.map((round, index) => (
          <RoundCard
            key={index}
            round={round}
            showingPercentages={showingPercentages}
            onDelete={() => handleDelete(round.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Rounds;
