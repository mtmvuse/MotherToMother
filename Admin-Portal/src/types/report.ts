export interface Report {
	id: number;
	org_name: string;
	date: Date;
	item_name: string;
	quantity: number;
	value: number | null;
	total: number | null;
	status: string;
}

export interface ReportResponse {
	report: Report[];
	totalNumber: number;
}
