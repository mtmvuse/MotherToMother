import { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm } from "../../../contexts/FormContext";
import type { DonationDetailType } from "../../../types/FormTypes";
import "./SpecificItemsDialog.css";
import { ErrorMessage } from "../../Error";

type SpecificItemsProps = {
  open: boolean;
  onClose: () => void;
  donationDetail: DonationDetailType;
};

export const SpecificItemsDialog = ({
  open,
  onClose,
  donationDetail,
}: SpecificItemsProps) => {
  const { category, item, newQuantity, usedQuantity } = donationDetail;
  const { setDonationDetails } = useForm();
  const [tempNewQuantity, setTempNewQuantity] = useState(newQuantity);
  const [tempUsedQuantity, setTempUsedQuantity] = useState(usedQuantity);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // Reset the state when the dialog is closed
      setTempNewQuantity(newQuantity);
      setTempUsedQuantity(usedQuantity);
    }
  }, [open, tempNewQuantity, tempUsedQuantity]);

  const handleSaveDetails = () => {
    if (tempNewQuantity === 0 && tempUsedQuantity === 0) {
      setError("Please enter a quantity for either new or used items.");
      return;
    }
    setDonationDetails((prev) => {
      const updatedDonationDetails = [...prev];
      const existingItemIndex = updatedDonationDetails.findIndex(
        (detail) => detail.item === item,
      );

      if (existingItemIndex !== -1) {
        // Item already exists, update it
        updatedDonationDetails[existingItemIndex] = {
          item,
          category,
          newQuantity: tempNewQuantity,
          usedQuantity: tempUsedQuantity,
        } as DonationDetailType;
      } else {
        // Item doesn't exist, add it
        updatedDonationDetails.push({
          item,
          category,
          newQuantity: tempNewQuantity,
          usedQuantity: tempUsedQuantity,
        } as DonationDetailType);
      }
      return updatedDonationDetails;
    });
    handleClose();
  };

  const handleCancelDetails = () => {
    setTempNewQuantity(newQuantity);
    setTempUsedQuantity(usedQuantity);
    handleClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const preventMinus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  return (
    <div id="SpecificItems-Dialog">
      {error && <ErrorMessage error={error} setError={setError} />}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { borderRadius: "20px" } }}
      >
        <DialogTitle>
          <Typography
            align="center"
            sx={{ fontWeight: "bold" }}
            color="var(--mtmDarkGreen)"
            style={{
              fontFamily: "Raleway, sans-serif",
              fontSize: "25px",
              fontWeight: "700",
            }}
          >
            {category} - {item}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            align="center"
            sx={{ pb: "16px" }}
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Enter the number of new or used {category} you will donate.
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ marginTop: "8px", marginBottom: "8px" }}
          >
            <Typography
              sx={{
                fontWeight: "700",
                width: "60px",
                textAlign: "left",
                fontSize: "20px",
                color: "var(--mtmDarkGreen)",
              }}
            >
              NEW
            </Typography>
            <input
              type="number"
              value={tempNewQuantity === 0 ? "" : tempNewQuantity}
              onKeyDown={preventMinus}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || !isNaN(parseInt(value))) {
                  setTempNewQuantity(value === "" ? 0 : parseInt(value));
                }
              }}
              style={{
                width: "65px",
                height: "27px",
                top: "613px",
                left: "224px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9",
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            sx={{ marginTop: "8px", marginBottom: "8px" }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                width: "60px",
                textAlign: "left",
                fontSize: "20px",
                color: "var(--mtmDarkGreen)",
              }}
            >
              USED
            </Typography>
            <input
              type="number"
              value={tempUsedQuantity === 0 ? "" : tempUsedQuantity}
              onKeyDown={preventMinus}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || !isNaN(parseInt(value))) {
                  setTempUsedQuantity(value === "" ? 0 : parseInt(value));
                }
              }}
              style={{
                width: "65px",
                height: "27px",
                top: "613px",
                left: "224px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9",
              }}
            />
          </Stack>

          <Grid
            container
            spacing={1}
            direction={{ xs: "row", sm: "row" }}
            justifyContent="center"
            alignItems="center"
            sx={{ marginTop: "16px" }}
          >
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleCancelDetails}
                color="primary"
                sx={{
                  backgroundColor: "white",
                  color: "var(--mtmDarkGreen)",
                  border: "1px solid var(--mtmDarkGreen)",
                  height: "32px",
                  borderRadius: "10px",
                  fontFamily: "Interit, sans-serif",
                  fontSize: "15px",
                  fontWeight: "800",
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={handleSaveDetails}
                color="primary"
                sx={{
                  fontFamily: "Interit, sans-serif",
                  fontSize: "15px",
                  fontWeight: "800",
                  backgroundColor: "var(--mtmDarkGreen)",
                  color: "white",
                  borderRadius: "10px",
                  height: "32px",
                  width: "87px",
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};
