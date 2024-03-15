import React, { useEffect, useState } from "react";

import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import deleteIcon from "../../assets/delete-icon.png";

import { ItemDetails } from "~/types/DonationTypes";
import "./styles/DonationDetails.css";

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
      headerName: "Item",
      type: "string",
      flex: 1.5,
      editable: false,
    },
    {
      field: "quantityUsed",
      headerName: "Used Quantity",
      type: "number",
      editable: editable,
      flex: 1,
    },
    {
      field: "quantityNew",
      headerName: "New Quantity",
      type: "number",
      editable: editable,
      flex: 1,
    },
    {
      field: "valueNew",
      headerName: "New Value",
      type: "number",
      editable: false,
      flex: 1,
      valueFormatter: (params) =>
        params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
    {
      field: "valueUsed",
      headerName: "Used Value",
      type: "number",
      editable: false,
      flex: 1,
      valueFormatter: (params) =>
        params.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
    },
  ];

  if (editable) {
    columns.push({
      field: "actions",
      type: "actions",
      align: "right",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<img src={deleteIcon} />}
          label="Delete"
          onClick={handleDeleteRow(params.id)}
        />,
      ],
    });
  }

  return (
    <div className="details-table">
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
      <div
        style={{
          backgroundColor: "#f3f3f3",
          marginTop: "15px",
          borderRadius: "10px",
          padding: "13px",
          fontFamily: "Raleway, sans-serif",
          fontSize: "18px",
          color: "navy",
        }}
      >
        <div style={{ textAlign: "left", marginBottom: "8px" }}>
          Total Items
          <span style={{ color: "black", float: "right" }}>
            {totalQuantity}
          </span>
        </div>
        <div style={{ textAlign: "left" }}>
          Total Price
          <span style={{ color: "black", float: "right" }}>
            {totalPrice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemsTable;
