import React, { useEffect, useState } from "react";

import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

const statusOptions: string[] = ["Used", "New"];

interface DonationTableProps {
  selectedDonation: any;
  editable: boolean;
}

interface RowData {
  id: number;
  item: string;
  status: string;
  value: number;
  quantity: number;
}

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

const createData = (
  id: number,
  item: string,
  status: string,
  value: number,
  quantity: number,
): RowData => {
  return { id, item, status, value, quantity };
};

const initialRows: RowData[] = [
  createData(1, "Clothes", "Used", 4, 11),
  createData(2, "Cribs", "Used", 12, 110),
];

const ItemsTable: React.FC<DonationTableProps> = ({
  selectedDonation,
  editable,
}) => {
  const [rows, setRows] = useState<RowData[]>(initialRows);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const handleProcessRowUpdate = (updatedRow: RowData) => {
    const rowIndex = rows.findIndex((row) => row.id === updatedRow.id);
    const updatedRows = [...rows];
    updatedRows[rowIndex] = updatedRow;
    setRows(updatedRows);
    return updatedRow;
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
