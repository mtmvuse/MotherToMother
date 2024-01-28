import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
  },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    width: 200,
    valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
  },
  { field: "organization", headerName: "Organization", width: 350 },
  {
    field: "items",
    headerName: "Items",
    type: "number",
    width: 250,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "total",
    headerName: "Total",
    type: "number",
    width: 250,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "type",
    headerName: "Type",
    width: 250,
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
  return (
    <div style={{ height: 400, width: "100%" }}>
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

export default DonationsPage;
