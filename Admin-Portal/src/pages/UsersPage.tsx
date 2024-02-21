import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  type GridFilterModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getUsers,
  updateUser,
  getOrganizations,
  addUser,
  deleteUser,
  addOrganization,
} from "../lib/services";
import { USER_TYPE, PAGE_SIZE } from "../lib/constants";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  UserDashboardResponse,
  EditUserArgs,
  AddUserType,
  UserRow,
} from "../types/user";
import { Button, Box } from "@mui/material";
import FormDialog from "../components/FormDialog";
import DeleteAlertModal from "../components/DeleteAlertModal";
import UserDialog from "../components/users/UserDialog";
import OrganizationDialog from "../components/users/OrganizationDialog";
import type { Organization } from "../types/organization";
import { ErrorMessage } from "../components/ErrorMessage";
import { SuccessMessage } from "../components/SuccessMessage";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import ExportButton from "../components/ExportButton";

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openAddOrganization, setOpenAddOrganization] = React.useState(false);
  const [openEditUser, setOpenEditUser] = React.useState(false);
  const [openDeleteUser, setOpenDeleteUser] = React.useState(false);
  const [editRow, setEditRow] = React.useState<UserRow | undefined>();
  const [deleteRow, setDeleteRow] = React.useState<UserRow | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const queryClient = useQueryClient();

  const handleOpenAddUser = () => {
    setOpenAddUser(true);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const handleOpenAddOrganization = () => {
    setOpenAddOrganization(true);
  };

  const handleCloseAddOrganization = () => {
    setOpenAddOrganization(false);
  };

  const handleOpenEditUser = (row: UserRow) => {
    setEditRow(row);
    setOpenEditUser(true);
  };

  const handleCloseEditUser = () => {
    setEditRow(undefined);
    setOpenEditUser(false);
  };

  const handleOpenDeleteUser = (row: UserRow) => {
    setDeleteRow(row);
    setOpenDeleteUser(true);
  };

  const handleCloseDeleteUser = () => {
    setDeleteRow(undefined);
    setOpenDeleteUser(false);
  };

  const findOrganizationId = (organizationName: string) => {
    return organizationsQueryResponse.data?.find(
      (organization) => organization.name === organizationName
    )?.id;
  };

  const isAnyFilterValueUndefined = () => {
    return filterModel?.items.some((item) => item.value === undefined);
  };

  const usersQueryResponse = useQuery({
    queryKey: ["users", page, pageSize, filterModel, sortModel],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getUsers("token", page, pageSize, filterModel, sortModel)
        .then((res: Response) => res.json())
        .then((data: UserDashboardResponse) => {
          setTotalNumber(data.totalNumber);
          if (data === undefined) {
            throw new Error("No data: Internal Server Error");
          }
          return data.users;
        }),
    enabled: !isAnyFilterValueUndefined(),
  });

  const organizationsQueryResponse = useQuery({
    queryKey: ["organizations"],
    queryFn: () =>
      getOrganizations()
        .then((res: Response) => res.json())
        .then((data: Organization[]) => data),
  });

  const addMutation = useMutation({
    mutationFn: (data: AddUserType) => addUser(data),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot add user");
      } else {
        setSuccess(true);
      }
      handleCloseAddUser();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const addOrganizationMutation = useMutation({
    mutationFn: (data: Organization) => addOrganization(data, "token"),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot add organization");
      } else {
        setSuccess(true);
      }
      handleCloseAddOrganization();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: EditUserArgs) =>
      updateUser(data.id, data.userData, "token"),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot edit user");
      } else {
        setSuccess(true);
      }
      handleCloseEditUser();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id, "token"),
    onSuccess: (result: Response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      if (result.status === 400 || result.status === 500) {
        setError("Cannot delete user");
      } else {
        setSuccess(true);
      }
      handleCloseDeleteUser();
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleExport = async () => {
    try {
      const response = await getUsers("token", -1, -1, filterModel, sortModel);
      const data = await response.json();
      const csv = Papa.unparse(data.users);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "MTM users.csv");
    } catch (error: any) {
      setError(`Export failed with error: ${error.message}`);
    }
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const userData = {
      ...rest,
      organizationId: findOrganizationId(formJson.organization),
      password: "password",
    } as AddUserType;
    addMutation.mutate(userData);
  };

  const handleAddOrganization = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(
      (formData as any).entries()
    ) as Organization;
    addOrganizationMutation.mutate(formJson);
  };

  const handleEditUser = (event: React.FormEvent<HTMLFormElement>) => {
    if (!editRow) return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const data = {
      id: editRow.id,
      userData: {
        ...rest,
        organizationId: findOrganizationId(formJson.organization),
      } as EditUserArgs["userData"],
      token: "token",
    };
    editMutation.mutate(data);
  };

  const handleDeleteUser = () => {
    if (!deleteRow) return;
    deleteMutation.mutate(deleteRow.id);
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  if (usersQueryResponse.isLoading) return <div>Loading...</div>;
  if (usersQueryResponse.error)
    return (
      <ErrorMessage
        error={usersQueryResponse.error.message}
        setError={setError}
      />
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
      flex: 1,
      type: "number",
      align: "left",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 2,
      type: "singleSelect",
      valueOptions: Object.values(USER_TYPE),
      align: "left",
      headerAlign: "left",
    },
    {
      field: "organization",
      headerName: "Organization",
      flex: 2,
      type: "singleSelect",
      valueOptions: organizationsQueryResponse.data?.map(
        (organization) => organization.name
      ),
      align: "left",
      headerAlign: "left",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 2,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 3,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => {
            handleOpenEditUser(params.row);
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => {
            handleOpenDeleteUser(params.row);
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
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleOpenAddUser}
      >
        Add User
      </Button>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleOpenAddOrganization}
      >
        Add Organization
      </Button>
      <ExportButton handleExport={handleExport} />
      <DataGrid
        sx={{ width: "95%", height: "80vh" }}
        rows={usersQueryResponse.data || []}
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
      />

      <FormDialog
        title={"ADD A NEW USER"}
        handleClose={handleCloseAddUser}
        open={openAddUser}
        handleSubmit={handleAddUser}
      >
        <UserDialog organizations={organizationsQueryResponse.data} />
      </FormDialog>
      <FormDialog
        title={"ADD A NEW ORGANIZATION"}
        handleClose={handleCloseAddOrganization}
        open={openAddOrganization}
        handleSubmit={handleAddOrganization}
      >
        <OrganizationDialog />
      </FormDialog>
      <FormDialog
        title={"EDIT A USER"}
        handleClose={handleCloseEditUser}
        open={openEditUser}
        handleSubmit={handleEditUser}
      >
        <UserDialog
          organizations={organizationsQueryResponse.data}
          editRow={editRow}
        />
      </FormDialog>
      <DeleteAlertModal
        scenario={"user"}
        handleDelete={handleDeleteUser}
        open={openDeleteUser}
        handleClose={handleCloseDeleteUser}
      />
    </Box>
  );
};

export default UsersPage;
