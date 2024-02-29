import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import {
	DataGrid,
	GridToolbar,
	GridActionsCellItem,
	GridColDef,
	GridFilterModel,
	GridRowParams,
	GridSortModel,
	GridValueFormatterParams,
	GridValueGetterParams,
} from '@mui/x-data-grid';
import { getReports } from '../lib/services';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE } from '../lib/constants';
import { ReportResponse, Report } from '~/types/report';
import FormDialog from '../components/FormDialog';
import DeleteAlertModal from '../components/DeleteAlertModal';
import InventoryDialog from '../components/inventory/InventoryDialog';
import editIcon from '../assets/edit-icon.png';
import deleteIcon from '../assets/delete-icon.png';
import AddIcon from '@mui/icons-material/Add';
import './styles/datagrid.css';
import { report } from 'process';

const ReportsPage: React.FC = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
	const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
	const [totalNumber, setTotalNumber] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const queryClient = useQueryClient();

	const handleFilterModelChange = (model: GridFilterModel) => {
		console.log(model);
		setFilterModel(model);
	};

	const handleSortModelChange = (model: GridSortModel) => {
		console.log(`sorting${model}`);
		setSortModel(model);
	};

	const isAnyFilterValueUndefined = () => {
		return filterModel?.items.some((item) => item.value === undefined);
	};

	const reportQueryResponse = useQuery({
		queryKey: ['report', page, pageSize, filterModel, sortModel],
		placeholderData: keepPreviousData,
		queryFn: () =>
			getReports('token', page, pageSize, filterModel, sortModel)
				.then((res: Response) => res.json())
				.then((data: ReportResponse) => {
					if (data === undefined) {
						throw new Error('No data: Internal Server Error');
					}

					const renderReport = data.report.map((item: Report) => ({
						id: item.id,
						agency: item.org_name,
						date: item.date,
						items: item.item_name,
						quantity: item.quantity,
						value: item.value,
						total: item.total,
						status: item.status,
						type: 'Incoming',
					}));

					setTotalNumber(data.totalNumber);

					return renderReport;
				}),
		enabled: !isAnyFilterValueUndefined(),
	});

	const columns: GridColDef[] = [
		{
			field: 'agency',
			headerName: 'AGENCY',
			flex: 2,
			align: 'left',
			headerAlign: 'left',
		},
		{
			field: 'date',
			headerName: 'DATE',
			flex: 3,
			type: 'date',
			align: 'left',
			headerAlign: 'left',
			editable: true,
			valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
		},
		{
			field: 'items',
			headerName: 'ITEMS',
			flex: 3,
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
		{
			field: 'quantity',
			headerName: 'QUANTITY',
			flex: 3,
			type: 'number',
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
		{
			field: 'value',
			headerName: 'VALUE',
			flex: 3,
			type: 'number',
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
		{
			field: 'total',
			headerName: 'TOTAL',
			flex: 3,
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
		{
			field: 'status',
			headerName: 'STATUS',
			flex: 3,
			type: 'number',
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
		{
			field: 'type',
			headerName: 'TYPE',
			flex: 3,
			align: 'left',
			headerAlign: 'left',
			editable: true,
		},
	];

	return (
		<>
			<div className='grid-container'>
				<DataGrid
					rowHeight={40}
					rows={reportQueryResponse.data || []}
					columns={columns}
					pagination
					autoPageSize
					rowCount={totalNumber}
					paginationMode='server'
					onPaginationModelChange={(params) => {
						setPage(params.page);
						setPageSize(params.pageSize);
					}}
					onFilterModelChange={handleFilterModelChange}
					onSortModelChange={handleSortModelChange}
					sx={{ width: '100%', height: '68vh' }}
				/>
			</div>
		</>
	);
};

export default ReportsPage;
