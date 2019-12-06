import * as React from 'react';
import styles from './style.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { tl } from '../../components/translate';

const logo = require('../../../assets/images/eokhati_full_white.png');

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export interface EditCreateDialogType {
  open: boolean;
  title?: string | React.ReactElement;
  saveLabel?: string;
  handleClose?: () => void;
  handleSave?: () => void;
}

export default class EditCreateDialog extends React.Component<EditCreateDialogType> {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        TransitionComponent={Transition}
      >
        <AppBar style={{ position: 'relative' }}>
          <Toolbar>
            <img className={styles.logo} src={logo} />
            <Typography variant="title" color="inherit" style={{ flex: 1 }}>
              {this.props.title}
            </Typography>
            <Button color="inherit" onClick={this.props.handleClose}>
              {tl('cancel')}
            </Button>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </Dialog>
    )
  }
}
