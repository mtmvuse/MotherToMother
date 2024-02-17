import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import {
	DataGrid,
	GridActionsCellItem,
	GridColDef,
	GridRowId,
	GridRowParams,
	GridValueFormatterParams,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { PAGE_SIZE } from "../lib/constants";
import { addIventoryItem, getInventoryRows } from "../lib/services";
import { ResponseInventoryItem, inventoryRow } from "~/types/inventory";
import FormDialog from "../components/FormDialog";
import DeleteAlertModal from "../components/DeleteAlertModal";
import InventoryDialog from "../components/inventory/InventoryDialog";

//TODO
//delete reminder
//edit button
const categoryOptions: string[] = ["Books", "Clothes"];

const InventoryPage: React.FC = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [totalNumber, setTotalNumber] = useState(0);
	const [openAddInventory, setOpenAddInventory] = useState(false);
	const [openEditInventory, setOpenEditInventory] = useState(false);
	const [openDeleteInventory, setOpenDeleteInventory] = useState(false);
	const [deleteRow, setDeleteRow] = useState<inventoryRow | undefined>();
	const [editRow, setEditRow] = useState<inventoryRow | undefined>();
	const queryClient = useQueryClient();

	const handleOpenAddInventory = () => {
		setOpenAddInventory(true);
	};

	const handleCloseAddInventory = () => {
		setOpenAddInventory(false);
	};

	const handleOpenEditInventory = (row: inventoryRow) => {
		setEditRow(row);
		setOpenEditInventory(true);
	};

	const handleCloseEditInventory = () => {
		setEditRow(undefined);
		setOpenEditInventory(false);
	};
	const handleOpenDeleteInventory = (row: inventoryRow) => {
		setDeleteRow(row);
		setOpenDeleteInventory(true);
	};

	const handleCloseDeleteInventory = () => {
		setDeleteRow(undefined);
		setOpenDeleteInventory(false);
	};

	const inventoryQueryResponse = useQuery({
		queryKey: ["inventory", page, pageSize],
		placeholderData: keepPreviousData,
		//define type
		queryFn: () =>
			getInventoryRows("token", page, pageSize)
				.then((response: Response) => response.json())
				.then((data) => {
					console.log(data.inventory);
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

	const handleDeleteRow = () => {
		if (!deleteRow) return;
		handleCloseDeleteInventory();
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
				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						onClick={() => {
							handleOpenEditInventory(params.row);
						}}
						label="Edit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
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
			<Button
				variant="contained"
				sx={{ margin: "auto 10px 10px auto" }}
				onClick={handleOpenAddInventory}
			>
				Add Inventory Item
			</Button>
			<DataGrid
				editMode="row"
				sx={{ width: "95%", height: "80vh" }}
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
			/>
			<FormDialog
				title={"ADD A NEW INVENTORY ENTRY"}
				handleClose={handleCloseAddInventory}
				open={openAddInventory}
				handleSubmit={handleAddRow}
			>
				<InventoryDialog categories={categoryOptions} />
			</FormDialog>
			<FormDialog
				title={"EDIT A INVENTORY ENTRY"}
				handleClose={handleCloseEditInventory}
				open={openEditInventory}
				handleSubmit={() => {
					console.log("edited user");
				}}
			>
				<InventoryDialog categories={categoryOptions} editRow={editRow} />
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
