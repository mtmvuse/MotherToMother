import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
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
import FooterSummary from "../components/report/FooterSummary";
import ExportButton from "../components/ExportButton";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Calendar from "../components/Calendar";

const ReportsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
  const [totalNumber, setTotalNumber] = useState(0);

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
      editable: false,
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
      editable: false,
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "value",
      headerName: "VALUE",
      flex: 3,
      type: "number",
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "total",
      headerName: "TOTAL",
      flex: 3,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 3,
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: false,
      cellClassName: "type-style",
    },
    {
      field: "type",
      headerName: "TYPE",
      flex: 3,
      type: "string",
      align: "left",
      headerAlign: "left",
      editable: false,
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
        <Calendar setFilterModel={setFilterModel} />
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
