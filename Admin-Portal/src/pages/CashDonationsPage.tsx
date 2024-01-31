import React from "react";
import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

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
  { field: "donor", headerName: "Donor", flex: 4 },
  {
    field: "total",
    headerName: "Total",
    type: "number",
    flex: 3,
    align: "left",
    headerAlign: "left",
  },
];

const rows = [
  {
    id: 1,
    date: Date(),
    donor: "donor 1",
    total: 1000,
    type: "Outgoing",
  },
  {
    id: 2,
    date: Date(),
    donor: "donor 2",
    total: 1030,
    type: "Incoming",
  },
  {
    id: 3,
    date: Date(),
    donor: "donor 3",
    total: 10,
    type: "Incoming",
  },
];

const CashDonationsPage: React.FC = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" sx={{ margin: "auto 10px 10px auto" }}>
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
