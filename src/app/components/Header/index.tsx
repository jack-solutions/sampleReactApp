import * as React from 'react';
import styles from './style.module.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { store } from '../../../';
import { push } from 'react-router-redux';
import { Button } from '@material-ui/core';

const logo = require('../../../assets/images/eokhati_full_green.png');
export class Header extends React.Component {
  render() {
    return (
      <div className={styles.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <a style={{ cursor: 'pointer' }} onClick={() => store.dispatch(push('/'))}><img className={styles.logo} src={logo} /></a>
            <Button className={styles.login} color="inherit" onClick={() => store.dispatch(push('/login'))}>Login</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
