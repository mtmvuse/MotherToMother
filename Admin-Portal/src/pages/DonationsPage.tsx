import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@mui/material';
import {
	DataGrid,
	GridColDef,
	GridRowParams,
	GridValueGetterParams,
	GridActionsCellItem,
	type GridFilterModel,
	type GridSortModel,
} from '@mui/x-data-grid';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE } from '../lib/constants';
import { getDonations, deleteDonation } from '../lib/services';
import AddDonationModal from '../components/donations/AddDontaionModal';
import DonationDetailsIncoming from '../components/donations/DonationDetailsIncoming';
import DonationDetailsOutgoing from '../components/donations/DonationDetailsOutgoing';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import editIcon from '../assets/edit-icon.png';
import deleteIcon from '../assets/delete-icon.png';
import AddIcon from '@mui/icons-material/Add';
import './styles/datagrid.css';
import { DonationDashboardResponse, ResponseDonation } from '~/types/DonationTypes';
import Calendar from '../components/Calendar';

const modalStyle = {
	backgroundColor: '#fefefe',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	padding: '20px',
	border: '1px solid #888',
	width: '43%',
	height: '65%',
	maxHeight: '80vh',
	overflowY: 'auto',
	boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
	borderRadius: '10px',
	outline: 'none',
};

const DonationsPage: React.FC = () => {
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(PAGE_SIZE);
	const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>();
	const [sortModel, setSortModel] = useState<GridSortModel | undefined>();
	const [totalNumber, setTotalNumber] = useState(0);
	const [selectedDonation, setSelectedDonation] = useState<ResponseDonation>();
	const [incomingModalOpen, setIncomingModalOpen] = useState(false);
	const [outgoingModalOpen, setOutgoingModalOpen] = useState(false);
	const [addDonationModal, setAddDonationModalOpen] = React.useState(false);
	const [showSuccessAlert, setShowSuccessAlert] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const isAnyFilterValueUndefined = () => {
		return filterModel?.items.some((item) => item.value === undefined);
	};
	const handleSubmissionSuccess = () => {
		setShowSuccessAlert(true);
		queryClient.invalidateQueries({ queryKey: ['inventory'] });
	};
	const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
	const [deletingDonationId, setDeletingDonationId] = useState<number | null>(null);
	const handleAddDonation = () => setAddDonationModalOpen(true);
	const queryClient = useQueryClient();

	useEffect(() => {
		if (selectedDonation) {
			if (selectedDonation.type === 'Incoming') {
				setIncomingModalOpen(true);
			} else {
				setOutgoingModalOpen(true);
			}
		}
	}, [selectedDonation]);

	const handleOpenEdit = (params: GridRowParams) => {
		setSelectedDonation(params.row as ResponseDonation);
	};

	const handleCloseModal = () => {
		setSelectedDonation(undefined);
		setIncomingModalOpen(false);
		setOutgoingModalOpen(false);
		setAddDonationModalOpen(false);
	};

	const donationsQueryResponse = useQuery({
		queryKey: ['donation', page, pageSize, filterModel, sortModel],
		placeholderData: keepPreviousData,
		//define type
		queryFn: () =>
			getDonations('token', page, pageSize, filterModel, sortModel)
				.then((response: Response) => response.json())
				.then((data) => {
					setTotalNumber(data.totalNumber);
					const renderDonations = data.donationsAP.map((donation: ResponseDonation) => ({
						id: donation.id,
						date: donation.date,
						organization: donation.organization,
						type: donation.type,
						total: donation.total,
						items: donation.items,
					}));
					return renderDonations;
				})
				.catch((err: any) => {
					console.log(err);
				}),
		enabled: !isAnyFilterValueUndefined(),
	});

	const handleFilterModelChange = (model: GridFilterModel) => {
		setFilterModel(model);
	};

	const handleSortModelChange = (model: GridSortModel) => {
		setSortModel(model);
	};

	const columns: GridColDef[] = [
		{
			field: 'id',
			headerName: 'ID',
			flex: 2,
		},
		{
			field: 'date',
			headerName: 'Date',
			type: 'date',
			flex: 3,
			filterable: false,
			valueGetter: (params: GridValueGetterParams) => new Date(params.row.date),
		},
		{ field: 'organization', headerName: 'Organization', flex: 4 },
		{
			field: 'items',
			headerName: 'Items',
			type: 'number',
			flex: 3,
			align: 'left',
			headerAlign: 'left',
		},
		{
			field: 'total',
			headerName: 'Total',
			type: 'number',
			flex: 3,
			align: 'left',
			headerAlign: 'left',
			valueFormatter: (params) =>
				params.value.toLocaleString('en-US', {
					style: 'currency',
					currency: 'USD',
				}),
		},
		{
			field: 'type',
			headerName: 'Type',
			flex: 3,
		},
		{
			field: 'actions',
			type: 'actions',
			getActions: (params: GridRowParams) => [
				<GridActionsCellItem
					icon={<img src={editIcon} />}
					onClick={() => {
						handleOpenEdit(params);
					}}
					label='Edit'
				/>,
				<GridActionsCellItem
					icon={<img src={deleteIcon} />}
					onClick={() => {
						const donationId = params.row.id;
						openDeleteConfirmation(donationId);
					}}
					label='Delete'
				/>,
			],
		},
	];

	const openDeleteConfirmation = (donationId: number) => {
		setDeletingDonationId(donationId);
		setDeleteConfirmationOpen(true);
	};

	const closeDeleteConfirmation = () => {
		setDeleteConfirmationOpen(false);
		setDeletingDonationId(null);
	};

	const handleDeleteDonation = (donationId: number) => {
		deleteDonation(donationId)
			.then(() => {
				queryClient.invalidateQueries({ queryKey: ['donation'] });
				setShowSuccessAlert(true);
			})
			.catch((error) => {
				setError('Failed to delete donation');
			});
	};

	return (
		<Box>
			{showSuccessAlert && <SuccessMessage success={showSuccessAlert} setSuccess={setShowSuccessAlert} />}
			{error && <ErrorMessage error={error} setError={setError} />}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Calendar handleFilterModelChange={handleFilterModelChange} />
				<Button onClick={handleAddDonation} className='table-add-button' endIcon={<AddIcon />}>
					Add
				</Button>
			</div>
			<div className='grid-container'>
				<DataGrid
					rowHeight={40}
					rows={donationsQueryResponse.data || []}
					columns={columns}
					onRowClick={handleOpenEdit}
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

			<Modal open={incomingModalOpen} onClose={handleCloseModal}>
				<Box sx={modalStyle}>{selectedDonation && <DonationDetailsIncoming selectedDonation={selectedDonation} />}</Box>
			</Modal>
			<Modal open={outgoingModalOpen} onClose={handleCloseModal}>
				<Box sx={modalStyle}>{selectedDonation && <DonationDetailsOutgoing selectedDonation={selectedDonation} />}</Box>
			</Modal>
			<Modal open={addDonationModal} onClose={handleCloseModal}>
				<Box sx={modalStyle}>
					<AddDonationModal
						handleCloseModal={handleCloseModal}
						handleSubmissionSuccess={handleSubmissionSuccess}
						setError={setError}
					/>
				</Box>
			</Modal>
			<Box>
				<Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
					<DialogTitle>Confirm Save</DialogTitle>
					<DialogContent>
						<DialogContentText>Are you sure you want to delete this donation?</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								if (deletingDonationId !== null) {
									handleDeleteDonation(deletingDonationId);
									closeDeleteConfirmation();
								}
							}}
						>
							Delete
						</Button>
						<Button onClick={closeDeleteConfirmation}>Cancel</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</Box>
	);
};

export default DonationsPage;
