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
import { ReportResponse, ReportDisplay } from '~/types/report';
import FormDialog from '../components/FormDialog';
import DeleteAlertModal from '../components/DeleteAlertModal';
import InventoryDialog from '../components/inventory/InventoryDialog';
import editIcon from '../assets/edit-icon.png';
import deleteIcon from '../assets/delete-icon.png';
import AddIcon from '@mui/icons-material/Add';
import './styles/datagrid.css';
import { report } from 'process';

// Seed data for testing
// const rows = [
// 	{
// 		id: 1,
// 		agency: 'Baby to Baby',
// 		date: Date(),
// 		items: 'Car Seat',
// 		quantity: 20,
// 		value: 180,
// 		total: 3600,
// 		type: 'Outgoing',
// 	},
// 	{
// 		id: 2,
// 		agency: 'VUMC',
// 		date: Date(),
// 		items: 'Baby Bottles',
// 		quantity: 30,
// 		value: 400,
// 		total: 12000,
// 		type: 'Incoming',
// 	},
// 	{
// 		id: 3,
// 		agency: 'Diaper',
// 		date: Date(),
// 		items: 'Diapers',
// 		quantity: 50,
// 		value: 2,
// 		total: 100,
// 		type: 'Incoming',
// 	},
// 	{
// 		id: 4,
// 		agency: 'Baby to Baby',
// 		date: Date(),
// 		items: 'Car Seat',
// 		quantity: 20,
// 		value: 180,
// 		total: 3600,
// 		type: 'Outgoing',
// 	},
// 	{
// 		id: 5,
// 		agency: 'VUMC',
// 		date: Date(),
// 		items: 'Baby Bottles',
// 		quantity: 30,
// 		value: 400,
// 		total: 12000,
// 		type: 'Incoming',
// 	},
// 	{
// 		id: 6,
// 		agency: 'Diaper',
// 		date: Date(),
// 		items: 'Diapers',
// 		quantity: 50,
// 		value: 2,
// 		total: 100,
// 		type: 'Incoming',
// 	},
// 	{
// 		id: 7,
// 		agency: 'Baby to Baby',
// 		date: Date(),
// 		items: 'Car Seat',
// 		quantity: 20,
// 		value: 180,
// 		total: 3600,
// 		type: 'Outgoing',
// 	},
// 	{
// 		id: 8,
// 		agency: 'VUMC',
// 		date: Date(),
// 		items: 'Baby Bottles',
// 		quantity: 30,
// 		value: 400,
// 		total: 12000,
// 		type: 'Incoming',
// 	},
// 	{
// 		id: 9,
// 		agency: 'Diaper',
// 		date: Date(),
// 		items: 'Diapers',
// 		quantity: 50,
// 		value: 2,
// 		total: 100,
// 		type: 'Incoming',
// 	},
// ];

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
					setTotalNumber(data.totalNumber);
					console.log('queryRequest');
					console.log(data);
					return data;
				}),
		enabled: !isAnyFilterValueUndefined(),
	});

	const transformReportData = (data: ReportResponse | undefined): ReportDisplay[] => {
		const reports: ReportDisplay[] = [];
		console.log('transform');
		if (data && data.report) {
			data.report.forEach((report) => {
				const agency = report.Organization.name;

				report.donation.forEach((donation) => {
					const date = new Date(donation.date);

					donation.DonationDetail.forEach((detail) => {
						const { name, quantityUsed, quantityNew, valueUsed, valueNew } = detail.item;

						const reportDisplay: ReportDisplay = {
							id: reports.length + 1,
							agency,
							date,
							items: name,
							quantity: quantityNew,
							value: valueNew,
							total: valueNew * quantityNew,
							type: 'Donation',
						};

						reports.push(reportDisplay);
					});
				});
			});
		}
		return reports;
	};

	const rows = transformReportData(reportQueryResponse.data).slice(10);

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
					slots={{ toolbar: GridToolbar }}
					rowHeight={40}
					rows={rows}
					columns={columns}
					pagination
					paginationMode='server'
					// initialState={{
					// 	pagination: {
					// 		paginationModel: {
					// 			pageSize: 5,
					// 		},
					// 	},
					// }}
					// pageSizeOptions={[5, 10, 20]}
					// autoPageSize
					rowCount={rows.length}
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
