import React, { useState } from "react";
import { Button, Modal, Box } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import AddUserModal from "../Components/AddUserModal";
import AddOrganizationModal from "../Components/AddOrginizationModal";

const exampleRows = [
  {
    id: 1,
    name: "Joe Burrow",
    type: "Corporate",
    orginization: "Amazon",
    email: "joebrrow@gmail.com",
    phone: 1234567890,
  },

  {
    id: 2,
    name: "Josh Allen",
    type: "Other",
    orginization: "Target",
    email: "joshallen@gmail.com",
    phone: 1231231233,
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

let id_counter = 2;

const orginizationOptions: string[] = ["Amazon", "Target"];
const typeOptions: string[] = ["Corporate", "Other"];

const UsersPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [organizationModalOpen, setOrganizationModalOpen] = useState(false);

  const handleUserModal = () => {
    setUserModalOpen(true);
  };

  const handleOrginizationModal = () => {
    setOrganizationModalOpen(true);
  };

  const handleClose = () => {
    setUserModalOpen(false);
    setOrganizationModalOpen(false);
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: ++id_counter,
        name: "",
        type: "",
        orginization: "",
        email: "",
        phone: 0,
      },
    ]);
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 2,
      type: "number",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 3,
      type: "singleSelect",
      valueOptions: typeOptions,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "orginization",
      headerName: "Orginization",
      flex: 3,
      type: "singleSelect",
      valueOptions: orginizationOptions,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => {
            console.log("edit clicked");
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={handleDeleteRow(params.id)}
          label="Delete"
        />,
      ],
    },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleUserModal}
      >
        Add User
      </Button>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleOrginizationModal}
      >
        Add Orginization
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
      <Modal open={userModalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <AddUserModal></AddUserModal>
        </Box>
      </Modal>

      <Modal open={organizationModalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <AddOrganizationModal></AddOrganizationModal>
        </Box>
      </Modal>
    </div>
  );
};

export default UsersPage;
