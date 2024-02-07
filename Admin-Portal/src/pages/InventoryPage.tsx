import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const exampleRows = [
  {
    id: 1,
    itemName: "Baby Bath",
    category: "Baby",
    newStock: 200,
    newValue: 40,
    usedStock: 100,
    usedValue: 20,
  },
  {
    id: 2,
    itemName: "Car Seat",
    category: "Travel",
    newStock: 200,
    newValue: 40,
    usedStock: 100,
    usedValue: 20,
  },
];

let id_counter = 2;

const categoryOptions: string[] = ["Baby", "Travel", ""];
const backendUrl: String = import.meta.env.VITE_LOCAL_SERVER_URL as string;

async function fetchInventoryRows(page: number, pageSize: number) {
  fetch(`${backendUrl}/inventory/v1?page=${page}&pageSize=${pageSize}`)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

const InventoryPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {}
  );

  useEffect(() => {
    fetchInventoryRows(1, 25);
  });

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleAddRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: ++id_counter,
        itemName: "",
        category: "",
        newStock: 0,
        newValue: 0,
        usedStock: 0,
        usedValue: 0,
      },
    ]);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

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
      field: "itemName",
      headerName: "ITEM NAME",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "category",
      headerName: "CATEGORY",
      flex: 3,
      type: "singleSelect",
      valueOptions: categoryOptions,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "newStock",
      headerName: "NEW STOCK",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "newValue",
      headerName: "NEW VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toFixed(2).toLocaleString()}`;
      },
    },
    {
      field: "usedStock",
      headerName: "USED STOCK",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "usedValue",
      headerName: "USED VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toFixed(2).toLocaleString()}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => {
        const isEditMode = rowModesModel[params.id]?.mode == GridRowModes.Edit;

        if (isEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              onClick={handleSaveClick(params.id)}
              label="Save"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              onClick={handleCancelClick(params.id)}
              label="Cancel"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            onClick={handleEditClick(params.id)}
            label="Edit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            onClick={handleDeleteRow(params.id)}
            label="Delete"
          />,
        ];
      },
    },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleAddRow}
      >
        Add Inventory Item
      </Button>
      <DataGrid
        editMode="row"
        sx={{ width: "95%" }}
        rows={rows}
        columns={columns}
        onRowEditStop={handleRowEditStop}
        rowModesModel={rowModesModel}
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

//delete reminder
//edit button
