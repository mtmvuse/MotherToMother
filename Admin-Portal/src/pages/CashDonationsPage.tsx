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

const exampleRows = [
  {
    id: 1,
    date: "2/5/2024",
    donor: "Donor 1",
    total: 100,
  },
  {
    id: 2,
    date: "1/30/2024",
    donor: "Donor 1",
    total: 100,
  },
];

let id_counter = 2;

const donorOptions: string[] = ["Donor 1", "Donor 2", "Donor 3"];

const CashDonationsPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: ++id_counter,
        date: "1/1/2024",
        donor: "Donor 1",
        total: 0,
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
      field: "date",
      headerName: "Date",
      flex: 3,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "donor",
      headerName: "Donor",
      flex: 3,
      type: "singleSelect",
      valueOptions: donorOptions,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "total",
      headerName: "Total",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toLocaleString()}`;
      },
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
    </div>
  );
};

export default CashDonationsPage;
