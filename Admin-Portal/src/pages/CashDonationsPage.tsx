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
import FormDialog from "../components/FormDialog";
import CashDonationsDialog from "../components/cashDonations/cashDonationDialog";
import type { Organization } from "~/types/organization";
import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "../lib/services";
import editIcon from "../assets/edit-icon.png";
import deleteIcon from "../assets/delete-icon.png";
import AddIcon from "@mui/icons-material/Add";

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

  const handleOpenAddCashDonation = () => {
    setOpenAddCashDonation(true);
  };

  const handleDeleteRow = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
    --id_counter;
  };

  const handleCloseAddCashDonation = () => {
    setOpenAddCashDonation(false);
  };

  const handleAddCashDonation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCloseAddCashDonation();
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
      field: "donor",
      headerName: "Donor",
      flex: 3,
      type: "singleSelect",
      valueOptions: organizationsQueryResponse.data?.map(
        (organization) => organization.name
      ),
      align: "left",
      headerAlign: "left",
      editable: true,
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
          onClick={handleDeleteRow(params.id)}
          label="Delete"
        />,
      ],
    },
  ];
  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button className="table-add-button" onClick={handleOpenAddCashDonation}>
        Add Donation
      </Button>
      <div className="grid-container">
        <DataGrid
          className="mtm-datagrid"
          rowHeight={40}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25]}
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
    </div>
  );
};

export default CashDonationsPage;
