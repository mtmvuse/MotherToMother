import { Stack, Typography, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { SpecificItemsDialog } from "./SpecificItemsDialog";
import { useState } from "react";
import type { DonationDetailType } from "../../types/FormTypes";
import { useForm } from "../../contexts/FormContext";

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
      marginY="7px"
      width="95%"
      height="25px"
    >
      <Typography>{item}</Typography>
      <Typography className="subcategory-status">
        Used: {usedQuantity}
      </Typography>
      <Typography marginRight="15px">New: {newQuantity}</Typography>
      {isEditMode && (
        <>
          <IconButton onClick={handleOpenDialog}>
            <EditOutlinedIcon sx={{ fontSize: 20 }} color="primary" />
          </IconButton>
          <IconButton onClick={handleDelete}>
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
