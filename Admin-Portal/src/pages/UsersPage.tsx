import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const exampleRows = [
  {
    id: 1,
    name: "Joe Burrow",
    type: "Corporate",
    organization: "Amazon",
    email: "joebrrow@gmail.com",
    phone: 1234567890,
  },

  {
    id: 2,
    name: "Josh Allen",
    type: "Other",
    organization: "Target",
    email: "joshallen@gmail.com",
    phone: 1231231233,
  },
];

let id_counter = 2;

const organizationOptions: string[] = ["Amazon", "Target"];
const typeOptions: string[] = ["Corporate", "Other"];

const UsersPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);

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
      field: "organization",
      headerName: "Organization",
      flex: 3,
      type: "singleSelect",
      valueOptions: organizationOptions,
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
      >
        Add User
      </Button>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
      >
        Add Organization
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
    </div>
  );
};

export default UsersPage;
