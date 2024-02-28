import {
	AddInventoryItemType,
	EditInventoryItemType,
	ResponseInventoryItem,
} from "~/types/inventory";
import type { EditUserType, AddUserType } from "../types/user";
import type { Organization } from "~/types/organization";
import type { GridFilterModel, GridSortModel } from "@mui/x-data-grid";
import { filterModelToApiQuery, sortModelToApiQuery } from "./utils";
import { AddOutgoingDonationType } from "~/types/DonationTypes";

const mode = import.meta.env.MODE;
const backendUrl: string =
	mode === "development"
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
		method: "GET",
		headers: {
			"Content-Type": "appplication/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const addIventoryItem = async (inventoryItem: AddInventoryItemType) => {
	return await fetch(`${backendUrl}/inventory/v1`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(inventoryItem),
	});
};

export const editInventoryItem = async (editInfo: EditInventoryItemType) => {
	const inventoryItem = editInfo.data;
	const id = editInfo.id;
	return await fetch(`${backendUrl}/inventory/v1/id/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(inventoryItem),
	});
};

export const deleteInventoryItem = async (
	inventoryId: number,
	token: string
) => {
	return await fetch(`${backendUrl}/inventory/v1/delete/id/${inventoryId}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
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
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateUser = async (
	id: number,
	userData: EditUserType,
	token: string
) => {
	return await fetch(`${backendUrl}/users/v1/update/id/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});
};

export const deleteUser = async (id: number, token: string) => {
	return await fetch(`${backendUrl}/users/v1/delete/id/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const addUser = async (user: AddUserType) => {
	return await fetch(`${backendUrl}/registration/v1`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	});
};

export const getOrganizations = async (query?: string | undefined) => {
	const fetchURL = query
		? `${backendUrl}/organization/v1?type=${query}`
		: `${backendUrl}/organization/v1`;
	return await fetch(fetchURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const getModalUsers = async (query?: string | undefined) => {
	const fetchURL = query
		? `${backendUrl}/users/v1?type=${query}`
		: `${backendUrl}/users/v1`;
	return await fetch(fetchURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const getModalItems = async () => {
	const fetchURL = `${backendUrl}/items/v1`;
	return await fetch(fetchURL, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export const createOutgoingDonation = async (
	outgoingDonationData: AddOutgoingDonationType
) => {
	return await fetch(`${backendUrl}/donation/v1/outgoing`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(outgoingDonationData),
	});
};

export const addOrganization = async (
	organization: Organization,
	token: string
) => {
	return await fetch(`${backendUrl}/organization/v1`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(organization),
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
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
