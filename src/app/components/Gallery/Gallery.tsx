import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
});

class PermanentDrawerLeft extends React.Component<{ classes: any }, { active: number }> {
  constructor(props) {
    super(props);
    this.state = {
      active: 0
    }
  }
  render() {
    const { classes, children } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Gallery
          </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          <List>
            {React.Children.map(children, (child: any, index: number) => {
              return (<ListItem button selected={this.state.active === index}
                onClick={() => { this.setState({ active: index }) }}>
                <ListItemText>{child.props.name}</ListItemText>
              </ListItem>)
            })}
          </List>
        </Drawer>
        <main className={classes.content}>
          {React.Children.map(children, (child: any, index) => {
            if (this.state.active === index) {
              return <React.Fragment>
                <Typography variant="h4">
                  {child.props.name}
                </Typography>
                <Typography variant="body1">
                  {child.props.description}
                </Typography>
                <br />
                {child.props.children}
              </React.Fragment>
            }
          })}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(PermanentDrawerLeft);

export class GalleryItem extends React.Component<{ name: string, description: string | JSX.Element }> {
  render() {
    return null;
  }
}