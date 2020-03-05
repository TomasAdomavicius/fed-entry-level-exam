import axios from 'axios';

export type Ticket = {
	id: string;
	title: string;
	content: string;
	creationTime: number;
	userEmail: string;
	labels?: string[];
}

export type Response = {
	paginatedData: Ticket[],
	hasNextPage: boolean
}

export type ApiClient = {
	getTickets: (params: any) => Promise<Response>;
}

export const createApiClient = (): ApiClient => {
	return {
		getTickets: (params) => {
			return axios.get(`http://localhost:3232/api/tickets`, {params: params}).then((res) => res.data);
		}
	}
}



