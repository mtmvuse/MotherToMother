import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Box, Button, Icon, Typography, Dialog, DialogContent } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
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
	GridCellParams,
} from '@mui/x-data-grid';
import DeleteAlertModal from '../components/DeleteAlertModal';
import editIcon from '../assets/edit-icon.png';
import deleteIcon from '../assets/delete-icon.png';
import AddIcon from '@mui/icons-material/Add';
import { ArrowDropDown } from '@mui/icons-material';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { report } from 'process';
// Services and types
import { ReportResponse, Report } from '~/types/report';
import { Organization } from '~/types/organization';
import { getReports, getOrganizations } from '../lib/services';
import './styles/datagrid.css';
import FormDialog from '../components/FormDialog';
import { PAGE_SIZE } from '../lib/constants';
// Calendar imports
import { CalendarIcon, DatePicker } from '@mui/x-date-pickers/';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

/*
Concerns : 
MUI datecalendar range is only available in pro version can I use another package
considering this is admin website not mobile

Type does not exist in database so can't do a filter

Should there be a filter for status? 

Need to fix items since it is called item-name
*/

const ReportsPage: React.FC = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
	const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
	const [totalNumber, setTotalNumber] = useState(0);
	const [openCal, setOpenCal] = useState(false);
	const [organizations, setOrganizations] = useState<string[] | null>(null);
	const [agency, setAgency] = useState<string>('Agency');
	const [type, setType] = useState<string | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const queryClient = useQueryClient();

	const dataGridRef = useRef(null);

	useEffect(() => {
		const dataGridElement = document.querySelector('.MuiDataGrid-footerContainer');
		console.log(dataGridElement);
		// Calculate the position to insert the div
		const newDiv = document.createElement('div');
		newDiv.textContent = 'Newsefsefesf Div'; // Add content or any other attributes as needed

		if (dataGridElement && dataGridElement.parentNode) {
			dataGridElement.parentNode.insertBefore(newDiv, dataGridElement);
		}
	}, [dataGridRef.current]);

	const handleFilterModelChange = (model: GridFilterModel) => {
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
						agency: item.agency,
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
			cellClassName: 'type-style',
		},
		{
			field: 'type',
			headerName: 'TYPE',
			flex: 3,
			type: 'string',
			align: 'left',
			headerAlign: 'left',
			editable: true,
			cellClassName: 'type-style',
		},
	];

	const handleCalendarOpen = () => {
		setOpenCal(true);
	};

	const handleCalendarClose = () => {
		setOpenCal(false);
	};

	const handleCalendarSubmit = () => {};

	const handleCalendarCancel = () => {};

	const handleAgencyChange = (event: SelectChangeEvent) => {
		const value = event.target.value as string;
		setAgency(value);

		if (value === 'Agency') {
			setFilterModel(undefined);
		} else {
			const filter = [{ field: 'agency', operator: 'contains', value: value }];

			const updateFilterModel = {
				...filterModel,
				items: filter,
			};

			handleFilterModelChange(updateFilterModel);
		}
	};

	const handleTypeChange = (event: SelectChangeEvent) => {
		const value = event.target.value as string;
		setType(value);

		if (value === 'Type') {
			setFilterModel(undefined);
		} else {
			const filter = [{ field: 'type', operator: 'contains', value: value }];

			const updateFilterModel = {
				...filterModel,
				items: filter,
			};

			handleFilterModelChange(updateFilterModel);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getOrganizations();
				if (!response.ok) {
					setError('Failed to fetch organizations');
				}
				const orgObj = await response.json();
				const agencyList = orgObj.map((org: Organization) => org.name);
				setOrganizations(agencyList);
			} catch (error) {
				setError('Error fetching organizations:');
			}
		};

		fetchData();
	}, []);

	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-start',
				}}
			>
				<Button className='table-add-calendar-button' onClick={handleCalendarOpen} endIcon={<CalendarIcon />}>
					Choose Date
				</Button>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Dialog open={openCal} onClose={handleCalendarClose}>
						<DialogContent>
							<DateCalendar defaultValue={dayjs(Date())} value={dayjs('10-12-2021')} />
						</DialogContent>
					</Dialog>
				</LocalizationProvider>

				<Box sx={{ minWidth: 120 }}>
					<FormControl className='dropdown-filter' fullWidth variant='outlined'>
						<Select labelId='agency-filter' value={agency} onChange={handleAgencyChange}>
							<MenuItem value={'Agency'}>Agency</MenuItem>
							{organizations?.map((organization, index) => (
								<MenuItem key={index} value={organization}>
									{organization}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				{/* not finished yet, type field does not exist in database schema */}
				<Box sx={{ minWidth: 120 }}>
					<FormControl className='dropdown-filter' fullWidth variant='outlined'>
						<Select labelId='type-filter' value={type ?? 'Type'} onChange={handleTypeChange}>
							<MenuItem value={'Type'}>Type</MenuItem>
							<MenuItem key='Incoming' value='Incoming'>
								Incoming
							</MenuItem>
							<MenuItem key='Outgoing' value='Outgoing'>
								Outgoing
							</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* <ExportButton handleExport={() => {}} /> */}
			</div>
			<div className='grid-container'>
				<DataGrid
					className='report'
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
					ref={dataGridRef}
				/>
			</div>
		</>
	);
};

export default ReportsPage;
