import React from "react";
import { Ticket } from "./../api";
import Truncate from "react-truncate";

const ITEMS_TO_SHOW = 3;

type TicketListItemProps = {
  key: any;
  ticket: Ticket;
  handler: any;
};

type TicketListItemState = {
  expanded: boolean;
  truncated: boolean;
};

export class TicketListItem extends React.Component<TicketListItemProps, TicketListItemState> {
  constructor(props: any) {
    super(props);

    this.state = {
      expanded: false,
      truncated: false
    };

    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }

  handleTruncate(truncated: any) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated
      });
    }
  }

  toggleLines(event: any) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded
    });
  }

  renderLabels = (labels: string[]) => {
    return (
      <ul className="labels">
        {labels.map(label => (
          <li>{label}</li>
        ))}
      </ul>
    );
  };

  onHide = () => {
    this.props.handler(this.props.ticket.id);
  };

  public render() {
    const { ticket } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <li key={ticket.id} className="ticket">
        <button className="hide-btn" onClick={this.onHide}>
          Hide
        </button>
        <h5 className="title">{ticket.title}</h5>
        <div className="content">
          <Truncate
            lines={!expanded && ITEMS_TO_SHOW}
            ellipsis={<button onClick={this.toggleLines}>See more</button>}
            onTruncate={this.handleTruncate}
          >
            {ticket.content}
          </Truncate>
          {!truncated && expanded && (
            <button onClick={this.toggleLines}>See less</button>
          )}
        </div>
        <footer>
          <div className="meta-data">
            By {ticket.userEmail} |{" "}
            {new Date(ticket.creationTime).toLocaleString()}
          </div>
          {ticket.labels ? this.renderLabels(ticket.labels) : null}
        </footer>
      </li>
    );
  }
}
