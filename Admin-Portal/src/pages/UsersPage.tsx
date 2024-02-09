import React, { useState } from "react";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
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
  ResponseUser,
  UserDashboardResponse,
  EditUserArgs,
} from "../types/user";
import { Button, Box } from "@mui/material";
import FormDialog from "../components/FormDialog";
import AddUserDialog from "../components/users/AddUserDialog";
import type { Organization } from "~/types/organization";

const UsersPage: React.FC = () => {
  // TODO: Chaneg this to API call
  const organizationOptions: string[] = ["Amazon", "Target"];
  const [page, setPage] = useState(0);
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const queryClient = useQueryClient();

  const handleOpenAddUser = () => {
    setOpenAddUser(true);
  };

  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };

  const usersQueryResponse = useQuery({
    queryKey: ["users", page],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getUsers("token", page, PAGE_SIZE)
        .then((res: Response) => res.json())
        .then((data: UserDashboardResponse) => {
          const users = data.users;
          setTotalNumber(data.totalNumber);
          const renderUsers = users.map((user: ResponseUser) => {
            // clean up the data for frontend presentation
            return {
              ...user,
              name: user.firstName + " " + user.lastName,
              organization: user.Organization.name,
              type: user.userType,
              address:
                user.address +
                ", " +
                user.city +
                ", " +
                user.state +
                ", " +
                user.zip,
            };
          });
          return renderUsers;
        })
        .catch((err: any) => {
          console.error(err);
        }),
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
      updateUser(data.email, data.userData, "token"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const userData = {
      ...formJson,
      password: "password",
    };
    console.log(userData);
    addMutation.mutate(userData);
    handleCloseAddUser();
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
      editable: true,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 2,
      type: "singleSelect",
      valueOptions: Object.values(USER_TYPE),
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "organization",
      headerName: "Organization",
      flex: 2,
      type: "singleSelect",
      valueOptions: organizationOptions,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 2,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      // editable: true,
    },
    {
      field: "actions",
      type: "actions",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          onClick={() => {
            console.log("edit clicked");
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
    <Box sx={{ height: "80%", width: "100%" }}>
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
        sx={{ width: "95%" }}
        rows={usersQueryResponse.data || []}
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

      <FormDialog
        title={"ADD A NEW USER"}
        handleClose={handleCloseAddUser}
        open={openAddUser}
        handleSubmit={handleAddUser}
      >
        <AddUserDialog organizations={organizationsQueryResponse.data} />
      </FormDialog>
    </Box>
  );
};

export default UsersPage;
