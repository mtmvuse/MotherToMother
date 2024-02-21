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

import { itemTypes } from "~/types/DonationTypes";

const statusOptions: string[] = ["Used", "New"];

interface DonationTableProps {
  editable: boolean;
  rows: itemTypes[];
  setRows: any;
}

const ItemsTable: React.FC<DonationTableProps> = ({
  editable,
  rows,
  setRows,
}) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const handleProcessRowUpdate = (updatedRow: itemTypes) => {
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
      (sum, { value, quantity }) => sum + value * quantity,
      0
    );
    const newTotalQuantity = rows.reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
    setTotalPrice(newTotalPrice);
    setTotalQuantity(newTotalQuantity);
  }, [rows]);

  const columns: GridColDef[] = [
    {
      field: "item",
      headerName: "Item",
      type: "string",
      flex: 2,
      editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: statusOptions,
      editable: true,
      flex: 2,
    },
    {
      field: "value",
      headerName: "Value",
      align: "left",
      headerAlign: "left",
      type: "number",
      editable: true,
      flex: 2,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toLocaleString()}`;
      },
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

      <div style={{ textAlign: "right", marginRight: "5px" }}>
        <div>Total Price: {totalPrice}</div>
        <div>Total Quantity: {totalQuantity}</div>
      </div>
    </div>
  );
};

export default ItemsTable;
