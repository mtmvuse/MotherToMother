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
  getAdmin,
  updateAdmin,
  addAdmin,
  deleteAdmin,
} from "../lib/services";
import { ADMIN_TYPE, PAGE_SIZE } from "../lib/constants";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type {
  AdminDashboardResponse,
  EditAdminArgs,
  AdminRow,
} from "../types/admin";
import { Button, Box } from "@mui/material";
import FormDialog from "../components/FormDialog";
import DeleteAlertModal from "../components/DeleteAlertModal";
import AdminDialog from "../components/admin/adminDialog";
import type { Organization } from "~/types/organization";

const AdminsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openAddAdmin, setOpenAddAdmin] = React.useState(false);
  const [openEditAdmin, setOpenEditAdmin] = React.useState(false);
  const [openDeleteAdmin, setOpenDeleteAdmin] = React.useState(false);
  const [editRow, setEditRow] = React.useState<AdminRow | undefined>();
  const [deleteRow, setDeleteRow] = React.useState<AdminRow | undefined>();
  const queryClient = useQueryClient();

  const handleOpenAddAdmin = () => {
    setOpenAddAdmin(true);
  };

  const handleCloseAddAdmin = () => {
    setOpenAddAdmin(false);
  };

  const handleOpenEditAdmin = (row: AdminRow) => {
    setEditRow(row);
    setOpenEditAdmin(true);
  };

  const handleCloseEditAdmin = () => {
    setEditRow(undefined);
    setOpenEditAdmin(false);
  };

  const handleOpenDeleteAdmin = (row: AdminRow) => {
    setDeleteRow(row);
    setOpenDeleteAdmin(true);
  };

  const handleCloseDeleteAdmin = () => {
    setDeleteRow(undefined);
    setOpenDeleteAdmin(false);
  };

  // const findOrganizationId = (organizationName: string) => {
  //   return organizationsQueryResponse.data?.find(
  //     (organization) => organization.name === organizationName
  //   )?.id;
  // };

  const isAnyFilterValueUndefined = () => {
    return filterModel?.items.some((item) => item.value === undefined);
  };

  const adminQueryResponse = useQuery({
    queryKey: ["admin", page, pageSize, filterModel, sortModel],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getAdmin("token", page, pageSize, filterModel, sortModel)
        .then((res: Response) => res.json())
        .then((data: AdminDashboardResponse) => {
          setTotalNumber(data.totalNumber);
          return data.admin;
        })
        .catch((err: any) => {
          console.error(err);
        }),
    enabled: !isAnyFilterValueUndefined(),
  });

  // const organizationsQueryResponse = useQuery({
  //   queryKey: ["organizations"],
  //   queryFn: () =>
  //     getOrganizations()
  //       .then((res: Response) => res.json())
  //       .then((data: Organization[]) => data)
  //       .catch((err: any) => {
  //         console.error(err);
  //       }),
  // });

  const addMutation = useMutation({
    mutationFn: (data: any) => addAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: EditAdminArgs) =>
      updateAdmin(data.id, data.adminData, "token"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAdmin(id, "token"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });

  const handleAddAdmin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const adminData = {
      ...rest
    };
    addMutation.mutate(adminData);
    handleCloseAddAdmin();
  };

  const handleEditAdmin = (event: React.FormEvent<HTMLFormElement>) => {
    if (!editRow) return;
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const data = {
      id: editRow.id,
      adminData: {
        ...rest
      } as EditAdminArgs["adminData"],
      token: "token",
    };
    editMutation.mutate(data);
    handleCloseEditAdmin();
  };

  const handleDeleteAdmin = () => {
    if (!deleteRow) return;
    deleteMutation.mutate(deleteRow.id);
    handleCloseDeleteAdmin();
  };

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  if (adminQueryResponse.isLoading) return <div>Loading...</div>;
  if (adminQueryResponse.error)
    return <div>Error: {adminQueryResponse.error.message}</div>;

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
      field: "role",
      headerName: "Role",
      flex: 2,
      type: "singleSelect",
      valueOptions: Object.values(ADMIN_TYPE),
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
            handleOpenEditAdmin(params.row);
          }}
          label="Edit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          onClick={() => {
            handleOpenDeleteAdmin(params.row);
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
        onClick={handleOpenAddAdmin}
      >
        Add Admin
      </Button>

      <DataGrid
        sx={{ width: "95%", height: "80vh" }}
        rows={adminQueryResponse.data || []}
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
        title={"ADD A NEW ADMIN"}
        handleClose={handleCloseAddAdmin}
        open={openAddAdmin}
        handleSubmit={handleAddAdmin}
      >
        <AdminDialog />
      </FormDialog>
      <FormDialog
        title={"EDIT A ADMIN"}
        handleClose={handleCloseEditAdmin}
        open={openEditAdmin}
        handleSubmit={handleEditAdmin}
      >
        <AdminDialog
          editRow={editRow}
        />
      </FormDialog>
      <DeleteAlertModal
        scenario={"admin"}
        handleDelete={handleDeleteAdmin}
        open={openDeleteAdmin}
        handleClose={handleCloseDeleteAdmin}
      />
    </Box>
  );
};

export default AdminsPage;
