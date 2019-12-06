
import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

interface propsType {
  isLoading: boolean
}
const loadingIcon = () => {
  return (<CircularProgress style={{ color: 'white' }} thickness={5} />);
}
class StatefulButton extends React.Component<propsType> {
  render() {
    return (
      <Button {...(this.props)}>
        {this.props.isLoading ? loadingIcon : this.props.children}
      </Button>
    );
  }
}

export default StatefulButton;
