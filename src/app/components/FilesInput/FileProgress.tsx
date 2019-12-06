import * as React from 'react';
import ProgressBar from 'react-fine-uploader/progress-bar';

export default class FileProgress extends ProgressBar {
  constructor(props) {
    super(props);
  }
  public render(): JSX.Element {
    const percent = Math.round(this.state.bytesUploaded / this.state.totalSize * 100 || 0);

    return (
      <span hidden={this.state.hidden}>{percent}% / </span>
    );
  }
}
