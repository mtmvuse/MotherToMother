import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const typeOptions: string[] = ["Public", "Agency", "Corporate", ""];

const exampleRows = [
  {
    id: 1,
    name: "Elanil Erdugrul",
    type: typeOptions[0],
    organization: "Public",
    email: "elanil@gmail.com",
    phone: 6153790000,
    address: "2301 Vanderbilt Pl",
  },
  {
    id: 2,
    name: "Olivia Liu",
    type: typeOptions[1],
    organization: "Vanderbilt University",
    email: "olivia@gmail.com",
    phone: 6153790000,
    address: "2301 Vanderbilt Pl",
  },
  {
    id: 3,
    name: "Jane Doe",
    type: typeOptions[2],
    organization: "Amazon",
    email: "jane@amazon.com",
    phone: 6153790000,
    address: "2301 Vanderbilt Pl",
  },
];

let id_counter = 3;



const UsersPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: ++id_counter,
        name: "",
        type: "",
        organization: "",
        email: "",
        phone: 0,
        address: "",
      },
    ]);
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    --id_counter;
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
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 3,
      type: "tel",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 3,
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
        onClick={handleAddRow}
      >
        Add User
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
