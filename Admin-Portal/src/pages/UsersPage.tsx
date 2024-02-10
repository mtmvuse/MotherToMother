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
  UserRow,
} from "../types/user";
import { Button, Box } from "@mui/material";
import FormDialog from "../components/FormDialog";
import UserDialog from "../components/users/UserDialog";
import type { Organization } from "~/types/organization";

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const [openEditUser, setOpenEditUser] = React.useState(false);
  const [editRow, setEditRow] = React.useState<UserRow | undefined>();
  const queryClient = useQueryClient();

  const handleOpenAddUser = () => {
    setOpenAddUser(true);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const handleOpenEditUser = (row: UserRow) => {
    setEditRow(row);
    setOpenEditUser(true);
  };

  const handleCloseEditUser = () => {
    setOpenEditUser(false);
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
          return data.users;
        })
        .catch((err: any) => {
          console.error(err);
        }),
    enabled: !isAnyFilterValueUndefined(),
  });

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

  const addMutation = useMutation({
    mutationFn: (data: any) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: EditUserArgs) =>
      updateUser(data.id, data.userData, "token"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const userData = {
      ...rest,
      organizationId: findOrganizationId(formJson.organization),
      password: "password",
    };
    addMutation.mutate(userData);
    handleCloseAddUser();
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
    handleCloseEditUser();
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  if (usersQueryResponse.isLoading) return <div>Loading...</div>;
  if (usersQueryResponse.error)
    return <div>Error: {usersQueryResponse.error.message}</div>;

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
            console.log("delete clicked");
          }}
          label="Delete"
        />,
      ],
    },
  ];
  return (
    <Box>
      <Button
        variant="contained"
        sx={{ margin: "auto 10px 10px auto" }}
        onClick={handleOpenAddUser}
      >
        Add User
      </Button>
      <Button variant="contained" sx={{ margin: "auto 10px 10px auto" }}>
        Add Organization
      </Button>
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
    </Box>
  );
};

export default UsersPage;
