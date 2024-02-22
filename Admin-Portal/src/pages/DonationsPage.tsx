import React, { useState } from "react";
import { Button, Modal, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridValueGetterParams,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import AddDonationModal from "../components/donations/AddDontaionModal";
import DonationDetailsIncoming from "../components/donations/DonationDetailsIncoming";
import DonationDetailsOutgoing from "../components/donations/DonationDetailsOutgoing";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import "./table.css";

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
  const handleAddDonation = () => setAddDonationModalOpen(true);

  const handleOpenEditUser = (params: GridRowParams) => {
    setSelectedDonation(params.row as Donation);
    if (selectedDonation?.type === "Incoming") {
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

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 2,
    },
    {
      field: "date",
      headerName: "DATE",
      type: "date",
      flex: 3,
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
    },
    { field: "organization", headerName: "ORGANIZATION", flex: 4 },
    {
      field: "items",
      headerName: "ITEMS",
      type: "number",
      flex: 3,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "total",
      headerName: "TOTAL",
      type: "number",
      flex: 3,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "type",
      headerName: "TYPE",
      flex: 3,
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<img src={editIcon} />}
          onClick={() => {
            handleOpenEditUser(params.row);
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<img src={deleteIcon} />}
          onClick={() => {
            // handleOpenDeleteUser(params.row);
          }}
          label="Delete"
        />,
      ],
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        onClick={handleAddDonation}
        className="table-add-button"
        endIcon={<AddIcon />}
      >
        Add
      </Button>
      <div className="grid-container">
        <DataGrid
          rows={rows}
          rowHeight={40}
          columns={columns}
          pagination
          pageSizeOptions={[10, 25]}
          className="mtm-datagrid"
        />
      </div>

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
          <AddDonationModal />
        </Box>
      </Modal>
    </div>
  );
};

export default DonationsPage;
