import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import styles from './Dialog.module.css';

const OkhatiDialog = ({ title, description, next, cancel }) => {
  return (
    <Dialog open={true} classes={{root: styles.dialog}}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={next}>Confirm</Button>
        <Button variant="text" color="secondary" onClick={cancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default OkhatiDialog;