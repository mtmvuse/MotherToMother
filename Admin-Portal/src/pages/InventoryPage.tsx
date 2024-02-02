import React from "react";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const rows = [
  {
    id: 1,
    item: "Baby Bath",
    category: "Baby",
    status: "New",
    value: "20",
    stock: 400,
  },
  {
    id: 2,
    item: "Car Seat",
    category: "Travel",
    status: "Used",
    value: "40",
    stock: 600,
  },
];

const categoryOptions: string[] = ["Baby", "Travel"];
const statusOptions: string[] = ["New", "Used"];

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
    field: "item",
    headerName: "Item",
    flex: 3,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "category",
    headerName: "Category",
    flex: 3,
    type: "singleSelect",
    valueOptions: categoryOptions,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 3,
    type: "singleSelect",
    valueOptions: statusOptions,
    align: "left",
    headerAlign: "left",
    editable: true,
  },
  {
    field: "value",
    headerName: "Unit Value",
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
    field: "stock",
    headerName: "Stock/Amount",
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
        onClick={() => {
          console.log("delete clicked");
        }}
        label="Delete"
      />,
    ],
  },
];
const InventoryPage: React.FC = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" sx={{ margin: "auto 10px 10px auto" }}>
        Add Inventory Item
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

export default InventoryPage;
