import React, { useEffect, useState } from "react";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";

import { ItemDetails } from "~/types/DonationTypes";

interface DonationTableProps {
  editable: boolean;
  rows: ItemDetails[];
  setRows: any;
}

const ItemsTable: React.FC<DonationTableProps> = ({
  editable,
  rows,
  setRows,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const handleProcessRowUpdate = (updatedRow: ItemDetails) => {
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
    const newTotalPrice = rows.reduce(
      (sum, { valueNew, valueUsed, quantityNew, quantityUsed }) => {
        const totalValueNew = valueNew * quantityNew;
        const totalValueUsed = valueUsed * quantityUsed;
        return sum + totalValueNew + totalValueUsed;
      },
      0
    );
    const newTotalQuantity = rows.reduce(
      (sum, { quantityNew, quantityUsed }) => sum + quantityNew + quantityUsed,
      0
    );
    setTotalPrice(newTotalPrice);
    setTotalQuantity(newTotalQuantity);
  }, [rows]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      type: "string",
      flex: 2,
      editable: false,
    },
    {
      field: "quantityUsed",
      headerName: "Used Quantity",
      type: "number",
      editable: editable,
      flex: 2,
    },
    {
      field: "quantityNew",
      headerName: "New Quantity",
      type: "number",
      editable: editable,
      flex: 2,
    },
    {
      field: "valueNew",
      headerName: "New Value",
      type: "number",
      editable: false,
      flex: 2,
    },
    {
      field: "valueUsed",
      headerName: "Used Value",
      type: "number",
      editable: false,
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

      <div style={{ textAlign: "right", marginRight: "5px" }}>
        <div>Total Price: {totalPrice}</div>
        <div>Total Quantity: {totalQuantity}</div>
      </div>
    </div>
  );
};

export default ItemsTable;
