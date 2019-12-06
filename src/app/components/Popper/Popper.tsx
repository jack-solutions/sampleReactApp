import React, { MutableRefObject, ReactHTMLElement } from 'react';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import styles from './styles.module.css';

interface PropsType {
  open?: boolean;
  anchorEl: () => any;
  onClose?: () => void;
}

export default class OPoppoer extends React.Component<PropsType> {
  public render() {
    const { open = true, anchorEl, children, onClose } = this.props;
    return (
      <ClickAwayListener onClickAway={() => onClose && onClose()}>
        <Popper
          style={{ zIndex: 1299 }}
          open={open}
          anchorEl={() => anchorEl().current}
          transition
        >
          {({ TransitionProps }) => (
            <Zoom {...TransitionProps} timeout={150}>
              <Paper className={styles.paper}>{children}</Paper>
            </Zoom>
          )}
        </Popper>
      </ClickAwayListener>
    );
  }
}
