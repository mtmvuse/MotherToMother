import React from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";

interface DonationTableProps {
  selectedDonation: any;
  editable: boolean;
}

const columns: GridColDef[] = [
  { field: "kidGroup", headerName: "Group", flex: 2, editable: true },
  {
    field: "quantity",
    headerName: "Quantity",
    align: "left",
    headerAlign: "left",
    type: "number",
    editable: true,
    flex: 2,
  },
];

function createDemographicData(id: number, kidGroup: string, quantity: number) {
  return { id, kidGroup, quantity };
}

const rows: GridRowsProp = [
  createDemographicData(1, "White children", 10),
  createDemographicData(2, "Black children", 20),
  createDemographicData(3, "Asian children", 10),
];

const DemographicTable: React.FC<DonationTableProps> = ({
  selectedDonation,
  editable,
}) => {
  const totalKids = rows.reduce((sum, { quantity }) => sum + quantity, 0);

  return (
    <div>
      <DataGrid
        hideFooter={true}
        sx={{ minWidth: 600 }}
        rows={rows}
          columns={columns.map((column) => ({
          ...column,
          editable: editable ? column.editable : false,
        }))}

      />
      <div style={{ textAlign: "right", paddingRight: 20 }}>
        Total Kids: {totalKids}
      </div>
    </div>
  );
};

export default DemographicTable;
