import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import { TicketListItem } from './components/TicketListItem';
import {Dropdown, Label} from './components/Dropdown'

export type labelObject = {
	title: string;
	selected: boolean;
}

export type AppState = {
	tickets?: Ticket[];
	search: string;
	pageNumber: number;
	hasNextPage: boolean;
	idsToHide: string[];
	labels: Label[];
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pageNumber: 1,
		hasNextPage: true,
		idsToHide: [],
		labels: []
	}

	searchDebounce: any = null;

	async componentDidMount() {
		const tickets = await api.getTickets({page: this.state.pageNumber});
		const labels = await api.getLabels();

		this.setState({
			tickets: tickets.paginatedData,
			hasNextPage: tickets.hasNextPage,
			labels: labels.map(name => ({ title: name , selected: false}))
		});
	}

	onHide = (id: string) => {
		this.setState({idsToHide: [...this.state.idsToHide, id]});
	  };

	renderTickets = (tickets: Ticket[]) => {
		const filteredTickets = tickets
			.filter((t) => (!this.state.idsToHide.includes(t.id)));

		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<TicketListItem  key={ticket.id} ticket={ticket} handler = {this.onHide}>
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
			hasNextPage: response.hasNextPage,
			pageNumber: 1
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

	toggleSelected = async (title: string, selected: boolean) => {
		for (var i in this.state.labels) {
			if (this.state.labels[i].title === title) {
			   this.state.labels[i].selected = !selected;
			   break;
			}
		  }

		const response = await api.getTickets({page: this.state.pageNumber, 
			labels: this.state.labels.filter(l => l.selected).map(l => l.title)});

		this.setState({
			tickets: response.paginatedData,
			hasNextPage: response.hasNextPage
		});
	  }

	render() {
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
				<Dropdown toggleItem={this.toggleSelected} headerTitle="Select labels" list={this.state.labels}/>
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