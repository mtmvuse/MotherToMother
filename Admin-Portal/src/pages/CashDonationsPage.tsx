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
import FormDialog from "../components/FormDialog";
import CashDonationsDialog from "../components/cashDonations/cashDonationDialog";
import type { Organization } from "~/types/organization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCashDonation,
  deleteCashDonation,
  getCashDonations,
  getOrganizations,
} from "../lib/services";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import AddIcon from "@mui/icons-material/Add";
import DeleteAlertModal from "../components/DeleteAlertModal";
import { Add } from "@mui/icons-material";
import "./styles/datagrid.css";
import type {
  AddCashDonationType,
  CashDonation,
  CashDonationRow,
} from "~/types/cashDonationTypes";
import { PAGE_SIZE } from "../lib/constants";
import { ErrorMessage } from "../components/ErrorMessage";
import { SuccessMessage } from "../components/SuccessMessage";

const exampleRows = [
  {
    id: 1,
    date: "2/5/2024",
    donor: "Donor 1",
    total: 100,
  },
];

let id_counter = 2;

const CashDonationsPage: React.FC = () => {
  const [rows, setRows] = useState(exampleRows);
  const [openAddCashDonation, setOpenAddCashDonation] = React.useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOrgId, setselectedOrgId] = useState<number | null>(null);
  const [totalNumber, setTotalNumber] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);

  const [openDeleteCashDonation, setOpenDeleteCashDonation] =
    React.useState(false);
  const [deleteRow, setDeleteRow] = React.useState<
    CashDonationRow | undefined
  >();

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleOrgChange = (orgId: number | null) => {
    setselectedOrgId(orgId);
  };

  const handleOpenAddCashDonation = () => {
    setOpenAddCashDonation(true);
  };

  const handleDeleteRow = (id: GridRowId) => () => {};

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
    mutationFn: (data: AddCashDonationType) => addCashDonation(data),
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCashDonation(id, "token"),
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

  const handleAddCashDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const { organization, ...rest } = formJson;
    const cashDonationData = {
      ...rest,
      organizationId: selectedOrgId,
      total: Number(formJson.total),
      date: selectedDate,
    } as AddCashDonationType;

    addMutation.mutate(cashDonationData);
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

  const cashDonationsQueryResponse = useQuery({
    queryKey: ["cashDonations"],
    queryFn: () =>
      getCashDonations()
        .then((res: Response) => res.json())
        .then((data: CashDonation[]) => data)
        .catch((err: any) => {
          console.error(err);
        }),
  });

  if (cashDonationsQueryResponse.isLoading) return <div>Loading...</div>;
  if (cashDonationsQueryResponse.error)
    return (
      <ErrorMessage
        error={cashDonationsQueryResponse.error.message}
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
      flex: 2,
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
      valueGetter: (params: GridValueFormatterParams<CashDonation>) => {
        return params.row.Organization.name;
      },
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
            console.log("edit clicked");
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
          rows={cashDonationsQueryResponse.data || []}
          columns={columns}
          pagination
          autoPageSize
          rowCount={totalNumber}
          paginationMode="server"
          onPaginationModelChange={(params) => {
            setPage(params.page);
            setPageSize(params.pageSize);
          }}
          sx={{ width: "100%", height: "68vh" }}
        />
      </div>

      <FormDialog
        title={"ADD A CASH DONATION"}
        handleClose={handleCloseAddCashDonation}
        open={openAddCashDonation}
        handleSubmit={handleAddCashDonation}
      >
        <CashDonationsDialog
          organizations={organizationsQueryResponse.data}
          selectedDate={selectedDate}
          onOrgIdChange={handleOrgChange}
          onDateChange={handleDateChange}
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
