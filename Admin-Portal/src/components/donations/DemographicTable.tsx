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
  const kidOptions = [
    "Black Children",
    "White Children",
    "Black Children",
    "Asian Children",
    "Other Children",
  ];

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
      editable: true,
      type: "singleSelect",
      valueOptions: kidOptions,
    },
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

  if (editable) {
    columns.push({
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteRow(params.id)}
        />,
      ],
    });
  }

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
        processRowUpdate={handleProcessRowUpdate}
      />
      <div style={{ textAlign: "right", paddingRight: 20 }}>
        Total Kids: {totalKids}
      </div>
    </div>
  );
};

export default DemographicTable;
