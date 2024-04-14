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
  GridValueGetterParams,
} from "@mui/x-data-grid";
import FormDialog from "../components/FormDialog";
import CashDonationsDialog from "../components/cashDonations/cashDonationDialog";
import type { Organization } from "~/types/organization";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addCashDonation,
  deleteCashDonation,
  getCashDonations,
  getOrganizations,
  updateCashDonation,
} from "../lib/services";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import AddIcon from "@mui/icons-material/Add";
import DeleteAlertModal from "../components/DeleteAlertModal";
import "./styles/datagrid.css";
import type {
  AddCashDonationType,
  CashDonationRow,
  EditCashArgs,
  cdDashboardResponse,
} from "~/types/cashDonationTypes";
import { PAGE_SIZE } from "../lib/constants";
import { ErrorMessage } from "../components/ErrorMessage";
import { SuccessMessage } from "../components/SuccessMessage";
import Calendar from "../components/Calendar";
import { useAuth } from "../lib/contexts";

const CashDonationsPage: React.FC = () => {
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [openAddCashDonation, setOpenAddCashDonation] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const [editRow, setEditRow] = useState<CashDonationRow | undefined>();
  const [openEditCashDonation, setOpenEditCashDonation] = React.useState(false);

  const [openDeleteCashDonation, setOpenDeleteCashDonation] =
    React.useState(false);
  const [deleteRow, setDeleteRow] = React.useState<
    CashDonationRow | undefined
  >();

  const handleOpenAddCashDonation = () => {
    setOpenAddCashDonation(true);
  };

  const handleCloseAddCashDonation = () => {
    setOpenAddCashDonation(false);
  };

  const handleOpenDeleteCashDonation = (row: CashDonationRow) => {
    setDeleteRow(row);
    setOpenDeleteCashDonation(true);
  };

  const handleCloseDeleteCashDonation = () => {
    setDeleteRow(undefined);
    setOpenDeleteCashDonation(false);
  };

  const addMutation = useMutation({
    mutationFn: (data: AddCashDonationType) =>
      currentUser
        ?.getIdToken()
        .then((token) => addCashDonation(data, token)) as Promise<Response>,
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["cashDonation"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot add cash donation");
      } else {
        setSuccess(true);
      }
      handleCloseAddCashDonation();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleCloseEditCashDonation = () => {
    setEditRow(undefined);
    setOpenEditCashDonation(false);
  };

  const editMutation = useMutation({
    mutationFn: (data: EditCashArgs) =>
      currentUser
        ?.getIdToken()
        .then((token) =>
          updateCashDonation(data.id, data.cashData, token)
        ) as Promise<Response>,
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["cashDonation"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot edit user");
      } else {
        setSuccess(true);
      }
      handleCloseEditCashDonation();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      currentUser
        ?.getIdToken()
        .then((token) => deleteCashDonation(id, token)) as Promise<Response>,
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["cashDonation"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot delete cash donation");
      } else {
        setSuccess(true);
      }
      handleCloseDeleteCashDonation();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleDeleteCashDonation = () => {
    if (!deleteRow) return;
    deleteMutation.mutate(deleteRow.id);
  };

  const handleOpenEditCashDonation = (row: CashDonationRow) => {
    setEditRow(row);
    setOpenEditCashDonation(true);
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const handleAddCashDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { user, organization, ...rest } = formJson;
    const data = {
      ...rest,
      date: new Date(formJson.date),
      total: Number(formJson.total),
    } as AddCashDonationType;
    addMutation.mutate(data);
  };

  const organizationsQueryResponse = useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      getOrganizations()
        .then((res: Response) => res.json())
        .then((data: Organization[]) => data)
        .catch((err: any) => {
          console.error(err);
        }),
  });

  const isAnyFilterValueUndefined = () => {
    return filterModel?.items.some((item) => item.value === undefined);
  };

  const cdQueryResponse = useQuery({
    queryKey: ["cashDonation", page, pageSize, filterModel, sortModel],
    placeholderData: keepPreviousData,
    queryFn: () =>
      currentUser
        ?.getIdToken()
        .then((token) =>
          getCashDonations(token, page, pageSize, filterModel, sortModel)
        )
        .then((res: Response) => res.json())
        .then((data: cdDashboardResponse) => {
          setTotalNumber(data.totalNumber);
          if (data === undefined) {
            throw new Error("No data: Internal Server Error");
          }
          return data.cashDonation;
        }),
    enabled: !isAnyFilterValueUndefined(),
  });

  const handleEditRow = (event: React.FormEvent<HTMLFormElement>) => {
    if (!editRow) return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { user, organization, ...rest } = formJson;
    const data = {
      id: editRow.id,
      cashData: {
        ...rest,
        date: new Date(formJson.date),
        total: Number(formJson.total),
      } as EditCashArgs["cashData"],
      token: "token",
    };
    console.log(data);
    editMutation.mutate(data);
  };

  if (cdQueryResponse.isLoading) return <div>Loading...</div>;

  if (cdQueryResponse.error)
    return (
      <ErrorMessage error={cdQueryResponse.error.message} setError={setError} />
    );

  if (organizationsQueryResponse.isLoading) return <div>Loading...</div>;

  if (organizationsQueryResponse.error)
    return (
      <ErrorMessage
        error={organizationsQueryResponse.error.message}
        setError={setError}
      />
    );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1.5,
      type: "number",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 3,
      align: "left",
      headerAlign: "left",
      type: "date",
      filterable: false,
      valueFormatter: (params: GridValueFormatterParams) => {
        return new Date(params.value).toLocaleDateString();
      },
      valueGetter: (params: GridValueGetterParams) => new Date(params.value),
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1.5,
      type: "number",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 2,
      type: "text",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 2,
      type: "text",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "organization",
      headerName: "Donor",
      flex: 3,
      type: "singleSelect",
      valueOptions: organizationsQueryResponse.data?.map(
        (organization) => organization.name
      ),
      align: "left",
      headerAlign: "left",
    },
    {
      field: "total",
      headerName: "Total",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<number>) => {
        if (params.value == null) {
          return "$0";
        }
        return `$${params.value.toLocaleString()}`;
      },
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<img src={editIcon} />}
          onClick={() => {
            handleOpenEditCashDonation(params.row);
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<img src={deleteIcon} />}
          onClick={() => {
            handleOpenDeleteCashDonation(params.row);
          }}
          label="Delete"
        />,
      ],
    },
  ];
  return (
    <Box>
      {error && <ErrorMessage error={error} setError={setError} />}
      {success && <SuccessMessage success={success} setSuccess={setSuccess} />}
      <div style={{ display: "flex " }}>
        <Calendar
          filterModel={filterModel}
          setFilterModel={setFilterModel}
          handleFilterModelChange={handleFilterModelChange}
        />
        <Button
          className="table-add-button"
          onClick={handleOpenAddCashDonation}
          endIcon={<AddIcon />}
        >
          Add
        </Button>
      </div>

      <div className="grid-container">
        <DataGrid
          rowHeight={40}
          rows={cdQueryResponse.data || []}
          columns={columns}
          pagination
          autoPageSize
          rowCount={totalNumber}
          paginationMode="server"
          onPaginationModelChange={(params) => {
            setPage(params.page);
            setPageSize(params.pageSize);
          }}
          onFilterModelChange={handleFilterModelChange}
          onSortModelChange={handleSortModelChange}
          sx={{ width: "100%", height: "68vh" }}
        />
      </div>

      <FormDialog
        title={"ADD A CASH DONATION"}
        handleClose={handleCloseAddCashDonation}
        open={openAddCashDonation}
        handleSubmit={handleAddCashDonation}
      >
        <CashDonationsDialog organizations={organizationsQueryResponse.data} />
      </FormDialog>
      <FormDialog
        title={"EDIT A DONATION"}
        handleClose={handleCloseEditCashDonation}
        open={openEditCashDonation}
        handleSubmit={handleEditRow}
      >
        <CashDonationsDialog
          organizations={organizationsQueryResponse.data}
          editRow={editRow}
        />
      </FormDialog>
      <DeleteAlertModal
        scenario={"cash donation"}
        handleDelete={handleDeleteCashDonation}
        open={openDeleteCashDonation}
        handleClose={handleCloseDeleteCashDonation}
      />
    </Box>
  );
};

export default CashDonationsPage;
