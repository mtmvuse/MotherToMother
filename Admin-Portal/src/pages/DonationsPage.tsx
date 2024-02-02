import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import AddDonationModal from "../components/AddDontaionModal";

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

const DonationsPage: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalStyle = {
    backgroundColor: "#fefefe",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    border: "1px solid #888",
    width: "40%",
    maxHeight: "80vh", // Set maximum height to 80% of the viewport height
    overflowY: "auto", // Add vertical scrollbar if content exceeds the max height
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
    borderRadius: "10px",
    outline: "none",
  };
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
      >
        Add Donation
      </Button>
      <DataGrid
        sx={{ width: "95%" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25]}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <AddDonationModal />
        </Box>
      </Modal>
    </div>
  );
};

export default DonationsPage;
