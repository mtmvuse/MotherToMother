import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
} from "@mui/x-data-grid";
import { DemographicDetails, ItemDetails } from "~/types/DonationTypes";
import DeleteIcon from "@mui/icons-material/Delete";
import { Typography } from "@mui/material";

interface DonationTableProps {
  rows: any[];
  setRows: any;
  editable: boolean;
}

const DemographicTable: React.FC<DonationTableProps> = ({
  rows,
  setRows,
  editable,
}) => {
  const [totalKids, setTotalKids] = useState(0);

  const handleProcessRowUpdate = (updatedRow: DemographicDetails) => {
    const rowIndex = rows.findIndex((row) => row.id === updatedRow.id);
    const updatedRows = [...rows];
    updatedRows[rowIndex] = updatedRow;
    setRows(updatedRows);
    return updatedRow;
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  useEffect(() => {
    const newTotalKids = rows.reduce((sum, { quantity }) => sum + quantity, 0);
    setTotalKids(newTotalKids);
  }, [rows]);

  const columns: GridColDef[] = [
    {
      field: "kidGroup",
      headerName: "Group",
      flex: 2,
      editable: false,
      type: "string",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      align: "right",
      headerAlign: "left",
      type: "number",
      editable: editable,
      flex: 2,
    },
  ];

  return (
    <div>
      <Typography
        fontFamily="Raleway, sans-serif"
        fontSize={13}
        color="navy"
        mb={1}
        mt={2}
        style={{ letterSpacing: "2px" }}
      >
        DEMOGRAPHIC SUMMARY
      </Typography>
      <div
        className="demographic-table"
        style={{ backgroundColor: "#f3f3f3", borderRadius: "10px" }}
      >
        <DataGrid
          hideFooter={true}
          sx={{ minWidth: 600 }}
          rows={rows}
          columns={columns.map((column) => ({
            ...column,
            editable: editable ? column.editable : false,
          }))}
          processRowUpdate={handleProcessRowUpdate}
        />
      </div>
      <div
        style={{
          display: "flex",
          paddingRight: 20,
          fontFamily: "Raleway, sans-serif",
          fontSize: 20,
          backgroundColor: "#f3f3f3",
          marginTop: "15px",
          borderRadius: "10px",
          padding: "13px",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "navy" }}>Total Kids</span>
        <span style={{ color: "black", textAlign: "right" }}>{totalKids}</span>
      </div>
    </div>
  );
};

export default DemographicTable;
