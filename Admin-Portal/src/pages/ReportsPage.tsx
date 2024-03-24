import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Button, Dialog, DialogContent } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ErrorMessage } from "../components/ErrorMessage";
// Services and types
import { ReportResponse, Report } from "~/types/report";
import { Organization } from "~/types/organization";
import { getReports, getOrganizations, getModalItems } from "../lib/services";
import "./styles/datagrid.css";
import { PAGE_SIZE } from "../lib/constants";
// Calendar imports
import { CalendarIcon } from "@mui/x-date-pickers/";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import type { Range } from "react-date-range";

import FooterSummary from "../components/report/FooterSummary";
import ExportButton from "../components/ExportButton";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const ReportsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openCal, setOpenCal] = useState(false);
  const [date, setDate] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [amount, setAmount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const dataGridRef = useRef(null);
  const hasInsertedDivRef = useRef(false);
  const rootRef = useRef<any>(null);

  useEffect(() => {
    const dataGridElement = document.querySelector(
      ".MuiDataGrid-footerContainer"
    );

    if (dataGridElement && dataGridElement.parentNode) {
      if (!hasInsertedDivRef.current) {
        const newDiv = document.createElement("div");
        dataGridElement.parentNode.insertBefore(newDiv, dataGridElement);
        rootRef.current = ReactDOM.createRoot(newDiv);
        hasInsertedDivRef.current = true;
      }
    }

    if (rootRef.current) {
      rootRef.current.render(
        <FooterSummary totalAmount={total} totalValue={amount} />
      );
    }
  }, [dataGridRef.current, total, amount]);

  const handleFilterModelChange = (model: GridFilterModel) => {
    setFilterModel(model);
  };

  const handleSortModelChange = (model: GridSortModel) => {
    setSortModel(model);
  };

  const isAnyFilterValueUndefined = () => {
    return filterModel?.items.some((item) => item.value === undefined);
  };

  const reportQueryResponse = useQuery({
    queryKey: ["report", page, pageSize, filterModel, sortModel],
    placeholderData: keepPreviousData,
    queryFn: () =>
      getReports("token", page, pageSize, filterModel, sortModel)
        .then((res: Response) => res.json())
        .then((data: ReportResponse) => {
          if (data === undefined) {
            throw new Error("No data: Internal Server Error");
          }

          const renderReport = data.report.map((item: Report) => ({
            ...item,
            type: "Incoming",
          }));

          setTotalNumber(data.totalNumber);
          setAmount(data.totalAmount);
          setTotal(data.totalValue);

          return renderReport;
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

  const itemsQueryResponse = useQuery({
    queryKey: ["items"],
    queryFn: () =>
      getModalItems()
        .then((res: Response) => res.json())
        .then((data: Organization[]) => data),
  });

  const handleCalendarOpen = () => {
    setOpenCal(true);
  };

  const handleCalendarClose = () => {
    setOpenCal(false);
  };

  const handleExport = async () => {
    try {
      const response = await getReports(
        "token",
        -1,
        -1,
        filterModel,
        sortModel
      );
      const data = await response.json();
      const csv = Papa.unparse(data.report);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "MTM report.csv");
    } catch (error: any) {
      setError(`Export failed with error: ${error.message}`);
    }
  };

  const handleDateChange = (ranges: any) => {
    const filter = [
      {
        field: "date",
        operator: "<=",
        value: new Date(
          new Date(ranges.selection.endDate).setDate(
            new Date(ranges.selection.endDate).getDate() + 1
          )
        ).toISOString(),
      },
      {
        field: "date",
        operator: ">=",
        value: ranges.selection.startDate.toISOString(),
      },
    ];

    setDate([ranges.selection]);
    setFilterModel({ items: filter });
  };

  if (reportQueryResponse.isLoading) return <div>Loading...</div>;
  if (reportQueryResponse.error)
    return (
      <ErrorMessage
        error={reportQueryResponse.error.message}
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
  if (itemsQueryResponse.isLoading) return <div>Loading...</div>;
  if (itemsQueryResponse.error)
    return (
      <ErrorMessage
        error={itemsQueryResponse.error.message}
        setError={setError}
      />
    );

  const columns: GridColDef[] = [
    {
      field: "agency",
      headerName: "AGENCY",
      flex: 2,
      align: "left",
      type: "singleSelect",
      valueOptions: organizationsQueryResponse.data?.map(
        (organization) => organization.name
      ),
      headerAlign: "left",
    },
    {
      field: "date",
      headerName: "DATE",
      flex: 3,
      type: "date",
      align: "left",
      headerAlign: "left",
      editable: true,
      filterable: false,
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
    },
    {
      field: "item",
      headerName: "ITEMS",
      flex: 3,
      align: "left",
      type: "singleSelect",
      valueOptions: itemsQueryResponse.data?.map((item) => item.name),
      headerAlign: "left",
      editable: true,
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "value",
      headerName: "VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "total",
      headerName: "TOTAL",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 3,
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      cellClassName: "type-style",
    },
    {
      field: "type",
      headerName: "TYPE",
      flex: 3,
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: true,
      cellClassName: "type-style",
    },
  ];
  return (
    <>
      {error && <ErrorMessage error={error} setError={setError} />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          className="table-add-calendar-button"
          onClick={handleCalendarOpen}
          endIcon={<CalendarIcon />}
        >
          Choose Date
        </Button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Dialog open={openCal} onClose={handleCalendarClose} maxWidth={false}>
            <DialogContent>
              <DateRangePicker
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={date}
                direction="horizontal"
                rangeColors={["#4DAD45"]}
              />
            </DialogContent>
          </Dialog>
        </LocalizationProvider>

        <ExportButton handleExport={handleExport} />
      </div>

      <div className="grid-container">
        <DataGrid
          className="report"
          rowHeight={40}
          rows={reportQueryResponse.data || []}
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
          ref={dataGridRef}
        />
      </div>
    </>
  );
};

export default ReportsPage;
