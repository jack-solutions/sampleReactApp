import 'ListLoader.scss';
import * as React from 'react';

export class ListLoader extends React.PureComponent<{className?: string}> {
  public render() {
    return (
      <div className={`ListLoader ${this.props.className}`}>
        <div className="ListLoader__ellipsis">
          <div/><div/><div/><div/>
        </div>
      </div>
    );
  }
}
