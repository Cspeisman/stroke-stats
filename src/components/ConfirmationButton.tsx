import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

interface ConfirmationButtonProps {
  onConfirm: () => void;
  buttonText: string;
  buttonStyle?: React.CSSProperties;
  confirmationText?: string;
}

const ConfirmationButton: React.FC<ConfirmationButtonProps> = ({
  onConfirm,
  buttonText,
  buttonStyle,
  confirmationText = "Are you sure?",
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleButtonClick = () => {
    setIsConfirming(true);
  };

  const handleConfirm = () => {
    onConfirm();
    setIsConfirming(false);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <button onClick={handleButtonClick} style={{ ...buttonStyle }}>
        {buttonText}
      </button>
      <Dialog
        open={isConfirming}
        onClose={handleCancel}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">
          {confirmationText}
        </DialogTitle>
        <DialogContent>
          Are you sure? Click 'Yes' to proceed or 'No' to cancel.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationButton;
