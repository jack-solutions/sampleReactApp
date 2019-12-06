import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import styles from './styles.module.css';


const Info = ({ children, classes }) => {
  return (<Paper classes={classes} className={styles.infoPaper}>{children}</Paper>);
}

export default Info;

/**
 * padding: '32px 24px', margin: '16px'
 */