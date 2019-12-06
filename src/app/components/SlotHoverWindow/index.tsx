
import styles from './style.module.css';
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';


export default class SlotHoverWindow extends React.Component {
  state = {
    open: false,
  };

  openPatienBookingWindow = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render()
   {
    return (
      <div class={styles.windowBorder}>
          <label class={styles.textLine} >Start time: </label>
          <label >10:20</label>
          <br/>
            <Button size="small" fullWidth="true" variant="contained" color="primary" onClick={this.openPatienBookingWindow}  >
            Book 
            </Button>            

            <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
        <DialogTitle id="responsive-dialog-title">{" Reservation window"}</DialogTitle>
              
                <DialogContent>

                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell> 
                        <Typography variant='subtitle1' gutterBottom >
                                Date:
                                  </Typography></TableCell>
                      <TableCell> 
                      <Typography  variant='body1' gutterBottom >
                                  2076/2/2 
                      </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell> <Typography variant='subtitle1' gutterBottom >
                                Time:
                                  </Typography></TableCell>
                      <TableCell>  <Typography  variant='body1' gutterBottom >
                                  06:20 AM
                                  </Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>  <Typography className={styles.profile} variant='subtitle1' gutterBottom >
                                    Dr. Dinesh Dharel
                                  </Typography>
                      </TableCell>
                      <TableCell rowSpan={2}>  
                      <img src="https://picsum.photos/100/100/?random"   className={styles.profilePicture}     />
                                  
                        </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>  
                                  <Typography variant='body1' gutterBottom >
                                    General practitioner
                                  </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>  
                      <TextField required  id="patient-name"   label= "Name:"  defaultValue=""   />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>  
                      <TextField required id="patient-phone"   label= "Phone:"      defaultValue=""   />
                        </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell >  
                      <TextField required  id="reason-of-visit" multiline rows="4"  label= "Reason of visit:"      defaultValue=""   />
                        </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                </DialogContent>
                <DialogActions>
                <Button onClick={this.handleClose} color="primary">         
                  cancel
                </Button>
                  <Button onclick={this.handleClose} variant="contained" color="primary">
                    Book
                  </Button>
                </DialogActions>
              </Dialog>
      </div>
    );    
  }  
}