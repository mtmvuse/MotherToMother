import { Stack, Typography, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { SpecificItemsDialog } from "../SpecificItemDialog/SpecificItemsDialog";
import { useState } from "react";
import type { DonationDetailType } from "../../../types/FormTypes";
import { useForm } from "../../../contexts/FormContext";

type ReviewSectionItemEntryProps = {
  donationDetail: DonationDetailType;
  isEditMode: boolean;
};

const ReviewSectionItemEntry = (props: ReviewSectionItemEntryProps) => {
  const { donationDetail, isEditMode } = props;
  const { item, newQuantity, usedQuantity } = donationDetail;
  const { setDonationDetails } = useForm();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleDelete = () => {
    setDonationDetails((prev) => {
      const updatedDonationDetails = prev.filter(
        (detail) => !(detail.item === item),
      );
      return updatedDonationDetails;
    });
  };

  return (
      <Stack
          key={item}
          direction="row"
          justifyContent="space-between"
          marginY="10px"
          alignItems="center"
          width="95%"
      >
        {/* Wrap item name and limit width */}
        <Typography
            sx={{
              whiteSpace: "normal",
              width: "115px", // Adjust as needed
            }}
        >
          {item}
        </Typography>

        {/* Align "Used" and "New" quantities */}
        <Typography
            className="subcategory-status"
            sx={{
              whiteSpace: "normal",
              marginLeft: "auto",
              marginRight: "10px",
              fontSize: "14px",
            }}
        >
          Used: {usedQuantity}
        </Typography>
        <Typography
            marginRight="10px"
            sx={{ whiteSpace: "normal", fontSize: "14px" }}
        >
          New: {newQuantity}
        </Typography>

        {isEditMode && (
            <>
              <IconButton onClick={handleOpenDialog} sx={{ p: "2px" }}>
                <EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
              </IconButton>
              <IconButton onClick={handleDelete} sx={{ p: "2px" }}>
                <DeleteOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
              </IconButton>
            </>
        )}
        <SpecificItemsDialog
            open={openDialog}
            onClose={handleCloseDialog}
            donationDetail={donationDetail}
        />
      </Stack>
  );
};
export { ReviewSectionItemEntry };
