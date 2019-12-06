import * as React from "react";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

interface TabProps {
  title?: string;
  key?: string;
  automation?: string;
}

export const OTab: React.SFC<TabProps> = ({ children }) => {
  return children;
};

interface TabsProps {
  className?: string;
  defaultActive: string;
  automation: string;
}

interface TabsState {
  activeTab: number;
}

class OTabs extends React.Component<TabsProps, TabsState> {
  public constructor(props) {
    super(props);
    this.state = { activeTab: props.defaultActive };
  }

  public render() {
    return (
      <div className={`okhati-tabs ${this.props.className}`}>
        <Tabs
          value={this.state.tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, tab) => this.setState({ activeTab: tab })}
        >
          {React.Children.map(this.props.children, child => (
            <Tab label={child.props.title} />
          ))}
        </Tabs>
        <div className="okhati-tabs-content-wrap">
          {
            React.Children.map(this.props.children, (child, i) => (
              this.state.activeTab == i && child
            ))
          }
        </div>
      </div>
    );
  }
}

export default Tabs;
