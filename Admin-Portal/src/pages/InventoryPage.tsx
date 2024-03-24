import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridRowParams,
  GridSortModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import {
  addIventoryItem,
  deleteInventoryItem,
  editInventoryItem,
  getInventoryRows,
} from "../lib/services";
import { ResponseInventoryItem, inventoryRow } from "~/types/inventory";
import FormDialog from "../components/FormDialog";
import DeleteAlertModal from "../components/DeleteAlertModal";
import InventoryDialog from "../components/inventory/InventoryDialog";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import AddIcon from "@mui/icons-material/Add";
import "./styles/datagrid.css";
import { ErrorMessage } from "../components/ErrorMessage";
import { SuccessMessage } from "../components/SuccessMessage";

// TODO: make this into a constant in the constants file
const categoryOptions: string[] = ["Books", "Clothes"];

const InventoryPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddInventory, setOpenAddInventory] = useState(false);
  // const [openEditInventory, setOpenEditInventory] = useState(false);
  const [openDeleteInventory, setOpenDeleteInventory] = useState(false);
  const [deleteRow, setDeleteRow] = useState<inventoryRow | undefined>();
  // const [editRow, setEditRow] = useState<inventoryRow | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const handleOpenAddInventory = () => {
    setOpenAddInventory(true);
  };

  const handleCloseAddInventory = () => {
    setOpenAddInventory(false);
  };

  // const handleOpenEditInventory = (row: inventoryRow) => {
  //   setEditRow(row);
  //   setOpenEditInventory(true);
  // };

  // const handleCloseEditInventory = () => {
  //   setEditRow(undefined);
  //   setOpenEditInventory(false);
  // };
  const handleOpenDeleteInventory = (row: inventoryRow) => {
    setDeleteRow(row);
    setOpenDeleteInventory(true);
  };

  const handleCloseDeleteInventory = () => {
    setDeleteRow(undefined);
    setOpenDeleteInventory(false);
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const inventoryQueryResponse = useQuery({
    queryKey: ["inventory", page, pageSize, filterModel, sortModel],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getInventoryRows("token", page, pageSize, filterModel, sortModel)
        .then((response: Response) => response.json())
        .then((data) => {
          setTotalNumber(data.totalNumber);
          if (data === undefined) {
            throw new Error("No data: Internal Server Error");
          }
          const renderInventories = data.inventory.map(
            (item: ResponseInventoryItem) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              quantityNew: item.quantityNew,
              valueNew: item.valueNew,
              quantityUsed: item.quantityUsed,
              valueUsed: item.valueUsed,
            })
          );
          return renderInventories;
        })
        .catch((err: any) => {
          console.log(err);
        }),
    enabled: !filterModel,
  });

  const addMutation = useMutation({
    mutationFn: (data: any) => addIventoryItem(data),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot add inventory item");
      } else {
        setSuccess(true);
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // const editMutation = useMutation({
  //   mutationFn: (data: any) => editInventoryItem(data),
  //   onSuccess: (result: Response) => {
  //     queryClient.invalidateQueries({ queryKey: ["inventory"] });
  //     if (result.status === 400 || result.status === 500) {
  //       setError("Cannot edit inventory item");
  //     } else {
  //       setSuccess(true);
  //     }
  //   },
  //   onError: (error: Error) => {
  //     setError(error.message);
  //   },
  // });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteInventoryItem(id, "token"),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot delete inventory item");
      } else {
        setSuccess(true);
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleAddRow = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const itemData = {
      name: formJson.name,
      category: formJson.category,
      quantityNew: formJson.quantityNew,
      valueNew: formJson.valueNew,
      quantityUsed: formJson.quantityUsed,
      valueUsed: formJson.valueUsed,
    };
    addMutation.mutate(itemData);
    handleCloseAddInventory();
  };

  const handleDeleteRow = () => {
    if (!deleteRow) return;
    deleteMutation.mutate(deleteRow.id);
    handleCloseDeleteInventory();
  };

  // const handleEditRow = (event: React.FormEvent<HTMLFormElement>) => {
  //   if (!editRow) return;
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const formJson = Object.fromEntries((formData as any).entries());
  //   const itemData = {
  //     name: formJson.name,
  //     category: formJson.category,
  //     quantityNew: formJson.quantityNew,
  //     valueNew: formJson.valueNew,
  //     quantityUsed: formJson.quantityUsed,
  //     valueUsed: formJson.valueUsed,
  //   };
  //   const editData = { data: itemData, id: editRow.id };
  //   editMutation.mutate(editData);
  //   handleCloseEditInventory();
  // };

  if (inventoryQueryResponse.isLoading) return <div>Loading...</div>;
  if (inventoryQueryResponse.error)
    return (
      <ErrorMessage
        error={inventoryQueryResponse.error.message}
        setError={setError}
      />
    );

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
      field: "name",
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
      field: "quantityNew",
      headerName: "NEW STOCK",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      // editable: true,
    },
    {
      field: "valueNew",
      headerName: "NEW VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      // editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toFixed(2).toLocaleString()}`;
      },
    },
    {
      field: "quantityUsed",
      headerName: "USED STOCK",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      // editable: true,
    },
    {
      field: "valueUsed",
      headerName: "USED VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      // editable: true,
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
        return [
          // <GridActionsCellItem
          //   icon={<img src={editIcon} />}
          //   onClick={() => {
          //     handleOpenEditInventory(params.row);
          //   }}
          //   label="Edit"
          // />,
          <GridActionsCellItem
            icon={<img src={deleteIcon} />}
            onClick={() => {
              handleOpenDeleteInventory(params.row);
            }}
            label="Delete"
          />,
        ];
      },
    },
  ];
  return (
    <Box>
      {error && <ErrorMessage error={error} setError={setError} />}
      {success && <SuccessMessage success={success} setSuccess={setSuccess} />}
      <Button
        className="table-add-button"
        endIcon={<AddIcon />}
        onClick={handleOpenAddInventory}
      >
        Add
      </Button>
      <div className="grid-container">
        <DataGrid
          editMode="row"
          rowHeight={40}
          sx={{ width: "100%", height: "68vh" }}
          rows={inventoryQueryResponse.data || []}
          columns={columns}
          pagination
          autoPageSize
          rowCount={totalNumber}
          paginationMode="server"
          onPaginationModelChange={(params) => {
            setPage(params.page);
            setPageSize(params.pageSize);
          }}
          sortModel={sortModel}
          filterModel={filterModel}
          sortingOrder={["desc", "asc"]}
          onFilterModelChange={handleFilterModelChange}
          onSortModelChange={handleSortModelChange}
        />
      </div>
      <FormDialog
        title={"ADD A NEW INVENTORY ENTRY"}
        handleClose={handleCloseAddInventory}
        open={openAddInventory}
        handleSubmit={handleAddRow}
      >
        <InventoryDialog categories={categoryOptions} />
      </FormDialog>

      <DeleteAlertModal
        scenario={"Inventory Entry"}
        handleDelete={handleDeleteRow}
        open={openDeleteInventory}
        handleClose={handleCloseDeleteInventory}
      />
    </Box>
  );
};

export default InventoryPage;
{
  /* <FormDialog
title={"EDIT A INVENTORY ENTRY"}
handleClose={handleCloseEditInventory}
open={openEditInventory}
handleSubmit={handleEditRow}
>
<InventoryDialog categories={categoryOptions} editRow={editRow} />
</FormDialog> */
}
