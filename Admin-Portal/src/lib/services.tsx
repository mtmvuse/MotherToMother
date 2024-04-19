import { AddInventoryItemType, EditInventoryItemType } from '~/types/inventory';
import type { EditUserType, AddUserType } from '../types/user';
import type { EditAdminType, AddAdminType } from '../types/admin';
import type { Organization } from '~/types/organization';
import type { GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { filterModelToApiQuery, sortModelToApiQuery } from './utils';
import {
	AddIncomingDonationType,
	AddOutgoingDonationType,
	UpdateOutgoingDonationType,
	UpdateDonationType,
} from '~/types/DonationTypes';
import { AddCashDonationType, EditCashType } from '~/types/cashDonationTypes';

const mode = import.meta.env.MODE;
const backendUrl: string =
	mode === 'development'
		? (import.meta.env.VITE_LOCAL_SERVER_URL as string)
		: (import.meta.env.VITE_PRODUCTION_SERVER_URL as string);

export const getInventoryRows = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/inventory/v1?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'appplication/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const addIventoryItem = async (token: string | undefined, inventoryItem: AddInventoryItemType) => {
	return await fetch(`${backendUrl}/inventory/v1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(inventoryItem),
	});
};

export const editInventoryItem = async (token: string | undefined, editInfo: EditInventoryItemType) => {
	const inventoryItem = editInfo.data;
	const id = editInfo.id;
	return await fetch(`${backendUrl}/inventory/v1/id/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(inventoryItem),
	});
};

export const deleteInventoryItem = async (token: string | undefined, inventoryId: number) => {
	return await fetch(`${backendUrl}/inventory/v1/delete/id/${inventoryId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getAdminByEmail = async (email: string) => {
	const url = `${backendUrl}/adminFetch/v1?email=${email}`;
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const getUsers = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/users/v1/admin?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getCashDonations = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/cashDonation/v1?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateUser = async (id: number, userData: EditUserType, token: string) => {
	return await fetch(`${backendUrl}/users/v1/update/id/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});
};

export const updateCashDonation = async (id: number, cashData: EditCashType, token: string) => {
	return await fetch(`${backendUrl}/cashdonation/v1/update/id/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(cashData),
	});
};

export const deleteUser = async (id: number, token: string) => {
	return await fetch(`${backendUrl}/users/v1/delete/id/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const deleteCashDonation = async (id: number, token: string) => {
	return await fetch(`${backendUrl}/cashDonation/v1/delete/id/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const addUser = async (user: AddUserType, token: string) => {
	return await fetch(`${backendUrl}/registration/v1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(user),
	});
};

export const addCashDonation = async (CashDonation: AddCashDonationType, token: string | undefined) => {
	return await fetch(`${backendUrl}/cashDonation/v1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(CashDonation),
	});
};

export const getOrganizations = async (query?: string | undefined) => {
	const fetchURL = query ? `${backendUrl}/organization/v1?type=${query}` : `${backendUrl}/organization/v1`;
	return await fetch(fetchURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const getModalUsers = async (token: string | undefined, query?: string | undefined) => {
	const fetchURL = query ? `${backendUrl}/users/v1?type=${query}` : `${backendUrl}/users/v1`;
	return await fetch(fetchURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getUsersByOrganizationName = async (organizationName: string, token: string | undefined) => {
	const fetchURL = `${backendUrl}/users/v1?organizationName=${organizationName}`;
	return await fetch(fetchURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getModalItems = async () => {
	const fetchURL = `${backendUrl}/items/v1`;
	return await fetch(fetchURL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

export const addOrganization = async (organization: Organization, token: string) => {
	return await fetch(`${backendUrl}/organization/v1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(organization),
	});
};

export const createIncomingDonation = async (token: string | undefined, incomingDonationData: AddIncomingDonationType) => {
	return await fetch(`${backendUrl}/donation/v1/incoming`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(incomingDonationData),
	});
};

export const createOutgoingDonation = async (token: string | undefined, outgoingDonationData: AddOutgoingDonationType) => {
	return await fetch(`${backendUrl}/donation/v1/outgoing/ap`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(outgoingDonationData),
	});
};

export const getReports = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/report/v1/?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getDonations = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/donation/v1?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getDonationDetails = (token: string | undefined, donationId: number): Promise<Response> => {
	return fetch(`${backendUrl}/donation/v1/details/${donationId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getDonationDemographics = (token: string | undefined, donationId: number): Promise<Response> => {
	return fetch(`${backendUrl}/donation/v1/demographics/${donationId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const editOutgoingDonation = async (
	token: string | undefined,
	donationId: number,
	outgoingDonationData: UpdateOutgoingDonationType
) => {
	return await fetch(`${backendUrl}/donation/v1/outgoing/${donationId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(outgoingDonationData),
	});
};

export const editIncomingDonation = async (
	token: string | undefined,
	donationId: number,
	donationData: UpdateDonationType
) => {
	return await fetch(`${backendUrl}/donation/v1/incoming/${donationId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(donationData),
	});
};

export const deleteDonation = async (token: string | undefined, donationId: number) => {
	return await fetch(`${backendUrl}/donation/v1/delete/${donationId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getAdmin = async (
	token: string | undefined,
	page: number,
	pageSize: number,
	filterModel?: GridFilterModel,
	sortModel?: GridSortModel
) => {
	let url = `${backendUrl}/adminFetch/v1?page=${page}&pageSize=${pageSize}`;
	if (filterModel) {
		url += `&${filterModelToApiQuery(filterModel)}`;
	}
	if (sortModel) {
		url += `&${sortModelToApiQuery(sortModel)}`;
	}
	return await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateAdmin = async (id: number, adminData: EditAdminType, token: string | undefined) => {
	return await fetch(`${backendUrl}/admin/v1/update/id/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(adminData),
	});
};

export const deleteAdmin = async (id: number, token: string | undefined) => {
	return await fetch(`${backendUrl}/admin/v1/delete/id/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
};

export const addAdmin = async (admin: AddAdminType, token: string | undefined) => {
	return await fetch(`${backendUrl}/admin/v1`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(admin),
	});
};
