import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	search: string,
	pageNumber: number,
	hasNextPage: boolean;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: '',
		pageNumber: 1,
		hasNextPage: true
	}

	searchDebounce: any = null;

	async componentDidMount() {
		const response = await api.getTickets({page: this.state.pageNumber})
		this.setState({
			tickets: response.paginatedData,
			hasNextPage: response.hasNextPage
		});
	}

	renderLabels = (labels: string[]) => {
        return (<ul className='labels'>{labels.map((label) => (<li>{label}</li>))}</ul>);
    }

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<li key={ticket.id} className='ticket'>
				<h5 className='title'>{ticket.title}</h5>
				<p className='content'>{ticket.content.trim()}</p>
				<footer>
					<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					{ticket.labels ? this.renderLabels(ticket.labels) : null}
				</footer>
			</li>))}
		</ul>);
	}

	onSearch = async (val: string, newPage?: number) => {
		
		clearTimeout(this.searchDebounce);

		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	previousPage = async () => {
		const response = await api.getTickets({page: this.state.pageNumber - 1});
		this.setState({pageNumber: this.state.pageNumber - 1, tickets: response.paginatedData, hasNextPage: response.hasNextPage});
	}

	nextPage = async () => {
		const response = await api.getTickets({page: this.state.pageNumber + 1});
		this.setState({pageNumber: this.state.pageNumber + 1, tickets: response.paginatedData, hasNextPage: response.hasNextPage});
	}

	render() {	
		const {tickets} = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			{tickets ? <div className='results'>Showing {tickets.length} results</div> : null }	
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			
			<footer className="pagination">
                {this.state.pageNumber >1 ? <button onClick={this.previousPage}>previous page</button> : null}
                {this.state.hasNextPage ? <button onClick={this.nextPage}>next page</button> : null}
            </footer>
		</main>)
	}
}

export default App;