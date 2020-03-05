import React from 'react'
import {Ticket} from './../api'

type TicketListItemProps = {
    key: any;
	ticket: Ticket;
	handler: any;
}

export class TicketListItem extends React.Component<TicketListItemProps> {
	
	renderLabels = (labels: string[]) => {
        return (<ul className='labels'>{labels.map((label) => (<li>{label}</li>))}</ul>);
    }

    onHide = () => {
        this.props.handler(this.props.ticket.id);
	}

    public render() {
        const { ticket } = this.props;

        return <li key={ticket.id} className='ticket'>
            <button className='hide-btn' onClick={this.onHide}>Hide</button>
            <h5 className='title'>{ticket.title}</h5>
            <p className='content'>{ticket.content}</p>
            <footer>
                <div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
				{ticket.labels ? this.renderLabels(ticket.labels) : null}
            </footer>
        </li>
    }
}