export interface Report {
	id: number;
	agency: string;
	date: Date;
	item: string;
	quantity: number;
	value: number | null;
	total: number | null;
	status: string;
	type: string;
}

export interface ReportResponse {
	report: Report[];
	totalNumber: number;
	totalQuantity: number;
	totalValue: number;
}
