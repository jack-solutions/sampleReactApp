import * as React from 'react';
import styles from './styles.module.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { tl } from '../translate.jsx';


export interface EditCreateDialogType {
  open: boolean;
  title?: string | React.ReactElement<string>;
  footer?: React.ReactElement<string>;
  fullScreen?: boolean;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string | React.ReactElement<string>;
}

export const Footer = ({ children }) => {
  return (<React.Fragment>
    {children}
  </React.Fragment>)
}

export class Modal extends React.Component<EditCreateDialogType> {
  render() {
    const { title, saveLabel, fullScreen } = this.props;
    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        scroll={'paper'}
      >
        {
          title ? (
            <DialogTitle classes={{ root: styles.title }} disableTypography={true}>
              <Typography variant="h6" color={'inherit'}><Box fontSize={'1rem'} fontWeight={600}>{title}</Box></Typography>
            </DialogTitle>
          ) : null
        }
        <DialogContent classes={{ root: styles.content }} >
          {this.props.children}
        </DialogContent>
        <DialogActions className={styles.actions}>
          {
            <Button onClick={() => this.props.onClose()} color="primary">
              {tl('Cancel')}
            </Button>
          }
          {
            this.props.onSave && (<Button onClick={() => this.props.onSave()}
              variant="contained"
              color="primary">
              {saveLabel ? saveLabel : tl('Save')}
            </Button>)
          }
          {
            this.props.footer
          }
        </DialogActions>
      </Dialog>
    )
  }
}

export default withMobileDialog()(Modal);