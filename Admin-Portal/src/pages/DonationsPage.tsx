import React, { useState } from "react";
import { Button, Modal, Typography, Box, Alert } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import AddDonationModal from "../components/donations/AddDontaionModal";
import DonationDetailsIncoming from "../components/donations/DonationDetailsIncoming";
import DonationDetailsOutgoing from "../components/donations/DonationDetailsOutgoing";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    flex: 2,
  },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    flex: 3,
    valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
  },
  { field: "organization", headerName: "Organization", flex: 4 },
  {
    field: "items",
    headerName: "Items",
    type: "number",
    flex: 3,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "total",
    headerName: "Total",
    type: "number",
    flex: 3,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "type",
    headerName: "Type",
    flex: 3,
  },
];

const rows = [
  {
    id: 1,
    date: Date(),
    organization: "Baby to Baby",
    items: 35,
    total: 1000,
    type: "Outgoing",
  },
  {
    id: 2,
    date: Date(),
    organization: "VUMC",
    items: 45,
    total: 1030,
    type: "Incoming",
  },
  {
    id: 3,
    date: Date(),
    organization: "Public",
    items: 4,
    total: 10,
    type: "Incoming",
  },
];

const modalStyle = {
  backgroundColor: "#fefefe",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "20px",
  border: "1px solid #888",
  width: "40%",
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  borderRadius: "10px",
  outline: "none",
};

interface Donation {
  id: number;
  date: Date;
  organization: string;
  items: number;
  total: number;
  type: string;
}

const DonationsPage: React.FC = () => {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null
  );
  const [incomingModalOpen, setIncomingModalOpen] = useState(false);
  const [outgoingModalOpen, setOutgoingModalOpen] = useState(false);
  const [addDonationModal, setAddDonationModalOpen] = React.useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSubmissionSuccess = () => {
    setShowSuccessAlert(true);
  };

  const handleAddDonation = () => setAddDonationModalOpen(true);

  const handleRowClick = (params: GridRowParams) => {
    setSelectedDonation(params.row as Donation);
    if (params.row.type === "Incoming") {
      setIncomingModalOpen(true);
    } else {
      setOutgoingModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedDonation(null);
    setIncomingModalOpen(false);
    setOutgoingModalOpen(false);
    setAddDonationModalOpen(false);
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        onClick={handleAddDonation}
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
      >
        Add Donation
      </Button>
      <DataGrid
        sx={{ width: "95%" }}
        rows={rows}
        columns={columns}
        pagination
        pageSizeOptions={[10, 25]}
        onRowClick={handleRowClick}
      />
      <Modal open={incomingModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <DonationDetailsIncoming selectedDonation={selectedDonation} />
        </Box>
      </Modal>
      <Modal open={outgoingModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <DonationDetailsOutgoing selectedDonation={selectedDonation} />
        </Box>
      </Modal>
      <Modal open={addDonationModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <AddDonationModal
            handleCloseModal={handleCloseModal}
            handleSubmissionSuccess={handleSubmissionSuccess}
          />
        </Box>
      </Modal>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
          Donation submitted successfully!
        </Alert>
      )}
    </div>
  );
};

export default DonationsPage;
