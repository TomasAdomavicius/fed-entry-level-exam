import React, { Component } from "react";

export type Label = {
  title: string;
  selected: boolean;
};

type DropdownState = {
  listOpen: boolean
};

type DropDownProps = {
  headerTitle: string;
  list: Label[];
  toggleItem: any;
};

export class Dropdown extends Component<DropDownProps, DropdownState> {
  constructor(props: any) {
    super(props);
    this.state = {
      listOpen: false
    };
    this.close = this.close.bind(this);
  }

  componentDidUpdate() {
    const { listOpen } = this.state;
    setTimeout(() => {
      if (listOpen) {
        window.addEventListener("click", this.close);
      } else {
        window.removeEventListener("click", this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.close);
  }

  close() {
    this.setState({
      listOpen: false
    });
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }));
  }

  render() {
    const { list, toggleItem, headerTitle } = this.props;
    const { listOpen} = this.state;
    return (
      <div className="dropdown-wrapper">
        <div className="dropdown-header" onClick={() => this.toggleList()}>
          {headerTitle}
        </div>
        {listOpen && (
          <ul className="dropdown-list" onClick={e => e.stopPropagation()}>
            {list.map(item => (
              <li
                className={
                  item.selected
                    ? "dropdown-list-item-selected"
                    : "dropdown-list-item"
                }
                key={item.title}
                onClick={() => toggleItem(item.title, item.selected)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
