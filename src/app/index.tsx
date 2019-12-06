import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import ResourceCentre from './containers/ResourceCentre';
import ResourceCentreShow from './containers/ResourceCentre/show';
import ServiceProvider from './containers/ServiceProvider';
import Schedule from './containers/Schedule';
import Login from './containers/User/Login';
import Signup from './containers/User/Signup';
import Messenger from './containers/User/Messenger';
import Slots from './containers/Slots';
import Book from './components/Book';
import NavigationBar from './containers/NavigationBar';
import Notifications from './containers/FlashMessage/Notification';
import { isAuthenticated } from './auth/authentication';
import Dashboard from './containers/Dashboard';
import { getLanguage, setLanguage } from '../translations/translate';
import Account from './containers/User/Account';
import Gallery from './containers/Gallery/Gallery';
import Modals from './containers/Modals/Modals';
import ServiceList from './containers/Service/ServiceList';
import ClientList from './containers/Client/ClientList';
import { getAccount } from './actions/user';
import Terms from './containers/Pages/Terms';
import Reports from './containers/Reports/index';
import Assessment from './containers/Assessment/Assessment';
import EnsureUserComponent from './containers/EnsureUserComponent';
import queryString from 'query-string'
import { store } from '..';
import './styles/index.scss';

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      light: '#C8E6C9',
      main: '#009654',
      dark: '#007d46',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#0066ff',
      main: '#4CAF50',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    text: {
      primary: '#454545',
      secondary: '#454545',
    },
    // error: will use the default color
  },
  overrides: {
    MuiDialog: {
      paper: {
        borderRadius: '15px'
      },
      root: {
        borderRadius: '15px'
      }
    },
  },
});

function renderResourceRoutes(resource, Component) {
  return [
    <Route key={`/${resource}`} exact path={`/${resource}`} component={Component} />,
    <Route
      key={`/${resource}/new`}
      exact
      path={`/${resource}/new`}
      render={(props) => {
        return <Component {...props} createMode={true}></Component>;
      }}
    />,
    <Route
      key={`/${resource}/:id/edit`}
      exact
      path={`/${resource}/:id/edit`}
      render={(props) => {
        return (
          <Component {...props} editMode={true} resourceId={props.match.params.id}></Component>
        );
      }}
    />,
  ];
}
const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        rest.render ? (
          rest.render(props)
        ) : (
            <EnsureUserComponent component={component} {...props} />
          )
      ) : (
          <Redirect to="/login" />
        )
    }
  />
);

export const I18nContext = React.createContext({
  language: 'np',
  changeLanguage: (lang) => { },
});

export default class App extends React.Component<
  { loadAccountInfo: () => void },
  { language: string }
  > {
  constructor(props) {
    super(props);
    this.state = {
      language: getLanguage(),
    };
  }

  componentDidMount() {
    if (isAuthenticated()) {
      store.dispatch(getAccount());
    }
  }

  changeLanguage = (language) => {
    this.setState({ language });
    setLanguage(language);
  };

  render() {
    const { language } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
          <I18nContext.Provider value={{ language, changeLanguage: this.changeLanguage }}>
            <div style={{ display: 'flex' }}>
              <Modals />
              <Notifications />
              {isAuthenticated() && <NavigationBar />}
              <div
                style={{
                  marginTop: 50,
                  flexGrow: 1,
                  height: 'calc(100vh - 50px)',
                  paddingTop: '16px',
                }}
              >
                <Switch>
                  <PrivateRoute exact path="/" component={Dashboard} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/tos" component={Terms} />
                  <Route exact path="/signup/:referenceId" component={Signup} />
                  <Route exact path="/messenger/:userId" component={Messenger} />
                  {renderResourceRoutes('resourcecentres', ResourceCentre)}
                  <PrivateRoute exact path="/resourcecentres/:id" component={ResourceCentreShow} />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/employees"
                    component={ResourceCentreShow}
                  />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/serviceProviders"
                    component={ResourceCentreShow}
                  />
                  <PrivateRoute exact path="/serviceProviders" component={ServiceProvider} />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/employees/create"
                    render={(props) => {
                      return (
                        <ResourceCentreShow
                          {...props}
                          createMode={true}
                          resourceId={props.match.params.id}
                        />
                      );
                    }}
                  />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/employees/:employeeId/edit"
                    render={(props) => {
                      return (
                        <ResourceCentreShow
                          {...props}
                          editMode={true}
                          employeeId={props.match.params.employeeId}
                          resourceId={props.match.params.id}
                        />
                      );
                    }}
                  />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/serviceProviders/create"
                    render={(props) => {
                      return (
                        <ResourceCentreShow
                          {...props}
                          createSPMode={true}
                          resourceId={props.match.params.id}
                        />
                      );
                    }}
                  />
                  <PrivateRoute
                    exact
                    path="/resourcecentres/:id/serviceProviders/:serviceProviderId/edit"
                    render={(props) => {
                      return (
                        <ResourceCentreShow
                          {...props}
                          editSPMode={true}
                          serviceProviderId={props.match.params.serviceProviderId}
                          resourceId={props.match.params.id}
                        />
                      );
                    }}
                  />
                  <PrivateRoute
                    exact
                    path="/schedule"
                    render={(props) => {
                      return <EnsureUserComponent component={Schedule} {...props} />;
                    }}
                  />
                  <PrivateRoute
                    exact
                    path="/schedule/addSlots"
                    render={(props) => {
                      return (
                        <EnsureUserComponent
                          component={Schedule}
                          {...props}
                          openAddSlotModal={true}
                        />
                      );
                    }}
                  />
                  <PrivateRoute exact path="/createSlots" component={Slots} />
                  <PrivateRoute exact path="/bookSlot" component={Book} />
                  <PrivateRoute exact path="/dashBoard" component={Dashboard} />
                  <PrivateRoute exact path="/account" component={Account} />
                  <Route exact path="/gallery" component={Gallery} />
                  <PrivateRoute exact path="/services" component={ServiceList} />
                  <PrivateRoute exact path="/clients" component={ClientList} />
                  <PrivateRoute exact path="/clients/new" render={(props) => {
                    return (<ClientList {...props} mode={'create'} />)
                  }} />
                  <PrivateRoute exact path="/clients/:id" render={(props) => {
                    return (<ClientList {...props}
                      clientId={props.match.params.id} mode={'read'} />)
                  }} />
                  <PrivateRoute exact path="/clients/:id/edit" render={(props) => {
                    return (<ClientList {...props}
                      clientId={props.match.params.id} mode={'edit'} />)
                  }} />
                  <PrivateRoute exact path="/reports" component={Reports} />
                  <PrivateRoute exact path="/assessment" render={(props) => {
                    return (<Assessment {...props}
                      clientId={queryString.parse(props.location.search).clientId} mode={'create'} />)
                  }} />
                  <PrivateRoute exact path="/assessment/:id" render={(props) => {
                    return (<Assessment {...props}
                      clientId={queryString.parse(props.location.search).clientId}
                      assessmentId={props.match.params.id} mode={'read'} />)
                  }} />
                  <PrivateRoute exact path="/assessment/:id/edit" render={(props) => {
                    return (<Assessment {...props}
                      clientId={queryString.parse(props.location.search).clientId}
                      assessmentId={props.match.params.id} mode={'edit'} />)
                  }} />
                  <PrivateRoute
                    key={`/service/:id/edit`}
                    exact
                    path={`/service/:id/edit`}
                    render={(props) => {
                      return (
                        <ServiceList
                          {...props}
                          editMode={true}
                          resourceId={props.match.params.id}
                        ></ServiceList>
                      );
                    }}
                  />
                </Switch>
              </div>
            </div>
          </I18nContext.Provider>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}
