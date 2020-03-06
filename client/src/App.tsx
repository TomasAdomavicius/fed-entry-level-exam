import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import { TicketListItem } from './components/TicketListItem';

export type AppState = {
	tickets?: Ticket[];
	search: string;
	pageNumber: number;
	hasNextPage: boolean;
	idsToHide: string[];
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pageNumber: 1,
		hasNextPage: true,
		idsToHide: []
	}

	searchDebounce: any = null;

	async componentDidMount() {
		const response = await api.getTickets({page: this.state.pageNumber});

		this.setState({
			tickets: response.paginatedData,
			hasNextPage: response.hasNextPage
		});
	}

	handler = (id: string) => {
		this.setState({idsToHide: [...this.state.idsToHide, id]});
	  };

	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
			.filter((t) => (!this.state.idsToHide.includes(t.id)));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<TicketListItem  key={ticket.id} ticket={ticket} handler = {this.handler}>
			</TicketListItem>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);

		const response = await api.getTickets({page: this.state.pageNumber, search: val});

		this.setState({
			tickets: response.paginatedData,
			hasNextPage: response.hasNextPage
		});
	}

	onPreviousPage = async () => {
		const response = await api.getTickets({page: this.state.pageNumber - 1});
		this.setState({pageNumber: this.state.pageNumber - 1, tickets: response.paginatedData, hasNextPage: response.hasNextPage});
	}

	onNextPage = async () => {
		const response = await api.getTickets({page: this.state.pageNumber + 1});
		this.setState({pageNumber: this.state.pageNumber + 1, tickets: response.paginatedData, hasNextPage: response.hasNextPage});
	}

	onRestore = () => {
		this.setState({idsToHide: []});
	}

	render() {
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }
			{this.state.idsToHide.length === 1 ? <div className='hiden-results'>({this.state.idsToHide.length} hidden ticket - <button onClick={this.onRestore}>restore)</button></div> : null}
			{this.state.idsToHide.length > 1 ? <div className='hiden-results'>({this.state.idsToHide.length} hidden tickets - <button onClick={this.onRestore}>restore)</button></div> : null}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			
			<footer className="pagination">
                {this.state.pageNumber >1 ? <button onClick={this.onPreviousPage}>previous page</button> : null}
                {this.state.hasNextPage ? <button onClick={this.onNextPage}>next page</button> : null}
            </footer>
		</main>)
	}
}

export default App;