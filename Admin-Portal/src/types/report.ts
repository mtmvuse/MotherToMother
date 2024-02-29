export interface Report {
	id: number;
	agency: string;
	date: Date;
	items: string;
	quantity: number;
	value: number;
	total: number;
	status: String;
	type: String;
}

export interface ReportResponse {
	report: Report[];
	totalNumber: number;
}
