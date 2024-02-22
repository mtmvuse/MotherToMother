import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowParams,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import { addIventoryItem, addUser, getInventoryRows } from "../lib/services";
import { ResponseInventoryItem } from "~/types/inventory";
import FormDialog from "../components/FormDialog";
import AddInventoryDialog from "../components/inventory/AddInventoryDialog";
import AddIcon from "@mui/icons-material/Add";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";

export interface Row {
  id: number;
  itemName: String;
  category: String;
  newStock: number;
  newValue: number;
  usedStock: number;
  usedValue: number;
}

//TODO
//delete reminder
//edit button
//get category options from the backend
const categoryOptions: string[] = ["Baby", "Travel"];

const InventoryPage: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddInventory, setOpenAddInventory] = React.useState(false);
  const queryClient = useQueryClient();

  const handleOpenAddInventory = () => {
    setOpenAddInventory(true);
  };

  const handleCloseAddInventory = () => {
    setOpenAddInventory(false);
  };

  const inventoryQueryResponse = useQuery({
    queryKey: ["inventory", page, PAGE_SIZE],
    placeholderData: keepPreviousData,
    //define type
    queryFn: () =>
      getInventoryRows("token", page, PAGE_SIZE)
        .then((response: Response) => response.json())
        .then((data) => {
          setTotalNumber(data.totalNumber);
          const renderInventories = data.inventory.map(
            (item: ResponseInventoryItem) => ({
              id: item.id,
              itemName: item.name,
              category: item.category,
              newStock: item.quantityNew,
              newValue: item.valueNew,
              usedStock: item.quantityUsed,
              usedValue: item.valueUsed,
            })
          );
          return renderInventories;
        })
        .catch((err: any) => {
          console.log(err);
        }),
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => addIventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const handleAddRow = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const itemData = {
      name: formJson.itemName,
      category: formJson.category,
      quantityNew: formJson.newStock,
      valueNew: formJson.newValue,
      quantityUsed: formJson.usedStock,
      valueUsed: formJson.usedValue,
    };
    console.log(itemData);
    addMutation.mutate(itemData);
    handleCloseAddInventory();
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row: Row) => row.id !== id));
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
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<img src={editIcon} />}
          onClick={() => {}}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<img src={deleteIcon} />}
          onClick={() => {
            handleDeleteRow(params.row);
          }}
          label="Delete"
        />,
      ],
    },
  ];
  return (
    <div style={{ height: "80%", width: "100%" }}>
      <Button
        className="table-add-button"
        endIcon={<AddIcon />}
        onClick={handleOpenAddInventory}
      >
        Add
      </Button>
      <div className="grid-container">
        <DataGrid
          className="mtm-datagrid"
          rowHeight={40}
          editMode="row"
          rows={inventoryQueryResponse.data || []}
          columns={columns}
          pagination
          rowCount={totalNumber}
          pageSizeOptions={[PAGE_SIZE]}
          paginationMode="server"
          paginationModel={{ page: page, pageSize: PAGE_SIZE }}
          onPaginationModelChange={(params) => {
            setPage(params.page);
          }}
        />
      </div>
      <FormDialog
        title={"ADD A NEW INVENTORY ENTRY"}
        handleClose={handleCloseAddInventory}
        open={openAddInventory}
        handleSubmit={handleAddRow}
      >
        <AddInventoryDialog categories={categoryOptions} />
      </FormDialog>
    </div>
  );
};

export default InventoryPage;
