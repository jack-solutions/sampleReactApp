import * as React from 'react';
import styles from './style.module.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const img = require('../../../assets/images/doctorPic.png');

class Listing extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.listingContainer}>
          <div className={styles.doctorImage}>
              <img src={img} alt="Doctor's picture"
                  width={100}
                  height={100}
              />
          </div>
          <div className={styles.timeAndDoctor}>
            <div>08:00</div>
            <div>Mr. Doctor</div>
          </div>
          <Button variant="contained" color="primary" style={{ width: '100px', height: '50px', marginLeft: '50px', marginTop: '30px' }}
          >
            BOOK
          </Button>
        </div>

        <form>
          <TextField
              id="phone-number"
              label="Enter Phone Number"
              margin="normal"
          /><br />
          <TextField
              id="reason"
              label="Reason of Visit"
              margin="normal"
              fullWidth
              multiline={true}
              rows={2}
              rowsMax={4}
              style={{width: 400}}
          /><br />
          <Button variant="contained" color="primary">
          BOOK
        </Button>&nbsp;&nbsp;
          <Button variant="outlined" style={{ color: 'white', backgroundColor: 'grey' }}>
          Cancel
        </Button>
        </form>
         
      </div>
    )
  }
}

export default Listing;