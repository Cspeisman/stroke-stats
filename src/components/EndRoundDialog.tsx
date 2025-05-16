import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import type { HoleModel } from "../Round/Round";

interface EndRoundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  holes: HoleModel[];
}

export function EndRoundDialog({
  open,
  onCancel,
  onConfirm,
  holes,
}: EndRoundDialogProps) {
  const isFullRound = holes.length === 18 && holes.every((h) => h.strokes > 0);
  const totalScore = holes.reduce((sum, h) => sum + h.strokes, 0);
  const fairwaysHit = holes.filter((h) => h.fairwayStatus === "Hit").length;
  const greensInRegulation = holes.filter((h) => h.isGreenInRegulation).length;
  const twoPuttOrLess = holes.filter((h) => h.isTwoPuttOrLess).length;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="end-round-dialog-title"
    >
      <DialogTitle id="end-round-dialog-title">End Round</DialogTitle>
      <DialogContent>
        {isFullRound ? (
          <>
            <div style={{ marginTop: 16, marginBottom: 8, fontWeight: 600 }}>
              End of round summary
            </div>
            <div>Total Score: {totalScore}</div>
            <div>Fairways Hit: {fairwaysHit}/18</div>
            <div>GIR: {greensInRegulation}/18</div>
            <div>2-Putt or Less: {twoPuttOrLess}/18</div>
          </>
        ) : (
          "Are you sure you want to end your round? You haven't finished all 18 holes."
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {isFullRound ? "Keep editing" : "No"}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {isFullRound ? "Save" : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
