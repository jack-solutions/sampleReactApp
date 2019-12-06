import * as React from 'react';
import styles from './style.module.css';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Listing from './../Listing';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

export default class Book extends React.Component {

  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <form>
          <Typography variant="display3" gutterBottom>
          BOOK SLOT
          </Typography>
          <InputLabel htmlFor="resource-center">Choose Resource Center</InputLabel>
          &nbsp;&nbsp;
          <Select
            inputProps={{
              name: 'resource-center',
              id: 'resource-center',
            }}
          />
          <br /><br />

          <InputLabel htmlFor="service-provider">Choose Service Provider</InputLabel>
          &nbsp;&nbsp;
          <Select
            inputProps={{
              name: 'service-provider',
              id: 'service-provider',
            }} 
          /><br /><br />

          <Typography className={styles.bookDate} variant="headline" gutterBottom>
            TODAY 21 Baisakh 2075&nbsp;
          </Typography>
          <Icon className={styles.arrowRight}>arrow_right</Icon>

        </form>
        <div className="">
          <AppBar position="static">
            <Tabs value={this.state.value} onChange={this.handleChange}>
              <Tab label="Morning" />
              <Tab label="Day" />
              <Tab label="Evening" href="#basic-tabs" />
            </Tabs>
          </AppBar>
          {this.state.value === 0 && <TabContainer>Morning</TabContainer>}
          {this.state.value === 1 && <TabContainer>Day</TabContainer>}
          {this.state.value === 2 && <TabContainer>Evening</TabContainer>}
        </div>
        <Listing />
      </div>
    )
  }
}