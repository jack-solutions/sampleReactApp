import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

export const Menu = ({ children }) => {
  return (<div className="okhati-list-menu-items" ><div>{children}</div></div>);
}

export const MenuItem = ({ onClick, children }) => {
  return (
    <a className="okhati-list-menu-item" onClick={onClick}>{children}</a>
  )
}

export default class ListActions extends React.Component {

  public state = { active: false }
  render() {
    const { children, ...rest } = this.props;
    rest.onMenuItemClick = () => this.setState({ active: false })
    return (
      <ClickAwayListener onClickAway={() => this.setState({ active: false })}>
        <div className={`okhati-list-menu ${this.state.active ? 'okhati-list-menu-active' : ''}`}>
          <div className="okhati-list-menu-handle" onClick={() => this.setState({ active: true })}></div>
          {children(rest)}
        </div>
      </ClickAwayListener>
    );
  }
}