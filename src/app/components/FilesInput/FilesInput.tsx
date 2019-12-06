import './FilesInput.scss';

import * as React from 'react';
import FileInput from 'react-fine-uploader/file-input';
import Dropzone from 'react-fine-uploader/dropzone';
import Filesize from 'react-fine-uploader/filesize';
import ProgressBar from 'react-fine-uploader/progress-bar';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import FileProgress from './FileProgress';
import * as _ from 'lodash';
import Link from '@material-ui/core/Link';
import AttachmentIcon from '@material-ui/icons/AttachFile';
import CheckIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Clear';
import { Box } from '@material-ui/core';


export interface FilesInputInterface {
  showAttachmentFailedModal: () => void;
  label?: string;
  chooseFileLabel?: string;
  endpoint: string;
  deleteEndpoint: string;
  className?: string;
  onfilesChange?: (uuids: []) => any;
  authToken: string;
  defaultFiles: Array<{ id: number, name: string }>;
  onDefaultFileClick: (id: number) => void;
  sizeLimitLabel?: string;
  perFileSizeLimit?: number;
  attachmentDisabled: boolean;
}

export interface FileInputState {
  fileStatus: any;
  submittedFiles: any;
  hasFileSizeExcededError: boolean;
}

const ALLOWED_EXTENSIONS = ['bmp', 'csv', 'dat', 'doc', 'docx', 'gif', 'ico', 'jpg',
  'jpeg', 'numbers', 'odt', 'pages', 'pdf', 'png', 'ppt',
  'pptx', 'psd', 'txt', 'xls', 'xlsx', 'zip'];
export class FilesInput extends React.Component<FilesInputInterface, FileInputState> {
  private statusEnum: any;
  private uploader: any;
  private statusClass: any;
  constructor(props) {
    super(props);
    this.onStatusChanged = this.onStatusChanged.bind(this);
    this.uploader = new FineUploaderTraditional({
      options: {
        validation: {
          allowedExtensions: ALLOWED_EXTENSIONS
        },
        deleteFile: {
          enabled: true,
          endpoint: props.deleteEndpoint,
          customHeaders: {
            authorization: props.authToken
          }
        },
        request: {
          endpoint: props.endpoint,
          customHeaders: {
            authorization: props.authToken
          }
        },
        session: {
          endpoint: props.endpoint,
          customHeaders: {
            authorization: props.authToken
          }
        }
      }
    });
    this.state = {
      hasFileSizeExcededError: false,
      submittedFiles: [],
      fileStatus: {}
    };
    this.statusEnum = this.uploader.qq.status;
    this.statusClass = {
      [this.statusEnum.UPLOAD_SUCCESSFUL]: 'successful',
      [this.statusEnum.UPLOAD_FAILED]: 'failed'
    };
  }

  private onStatusChanged(idx, oldStatus, newStatus) {
    const { DELETED, CANCELED, UPLOAD_SUCCESSFUL, UPLOAD_FAILED, UPLOADING } = this.statusEnum;
    const fileStatus = _.cloneDeep(this.state.fileStatus);
    if ([DELETED, CANCELED, UPLOAD_SUCCESSFUL, UPLOAD_FAILED, UPLOADING].includes(newStatus)) {
      fileStatus[idx] = newStatus;
    }
    if (this.state.fileStatus[idx] !== fileStatus[idx]) {
      this.setState({ fileStatus }, () => this.propagateFilesChange());
    }
  }

  private deleteFile(idx) {
    if (this.state.fileStatus[idx] === this.statusEnum.UPLOAD_SUCCESSFUL) {
      this.uploader.methods.deleteFile(idx);
    } else {
      this.uploader.methods.cancel(idx);
    }
  }

  private shouldShow(status) {
    return ![this.statusEnum.DELETED, this.statusEnum.CANCELED].includes(status);
  }

  private canRetry(status) {
    return status === this.statusEnum.UPLOAD_FAILED;
  }

  private propagateFilesChange() {
    const uuids = this.state.submittedFiles.map((sf: any, id) => {
      if (this.shouldShow(this.state.fileStatus[id])) {
        return sf.uuid
      }
    }).filter((uuid) => uuid);
    this.props.onfilesChange(uuids);
  }

  private setMaxFileSizeLimitError() {
    this.setState({ hasFileSizeExcededError: true });
    setTimeout(() => { this.setState({ hasFileSizeExcededError: false }); }, 7000);
  }

  public componentDidMount() {
    this.uploader.on('statusChange', this.onStatusChanged);
    this.uploader.on('complete', (id, name, fileData) => {
      if (fileData.success) {
        const submittedFiles = this.state.submittedFiles.concat([]);
        submittedFiles[id] = fileData;
        console.log(submittedFiles);
        this.setState({ submittedFiles }, () => this.propagateFilesChange());
      }
    });
    this.uploader.on('error', (errorCode, file, errorType, res = { responseText: '' }) => {
      if (errorType === 'maxTotalSizeExceeded' || res.responseText.includes('max request')) {
        this.setMaxFileSizeLimitError();
      }
    });
    this.uploader.on('submitted', (id, name) => {
      const submittedFiles = this.state.submittedFiles
        .concat([{ name, canDelete: true }]);
      this.setState({ submittedFiles });
    });
    this.uploader.on('sessionRequestComplete', (submittedFiles) => {
      this.setState({ submittedFiles }, () => this.propagateFilesChange());
    });
  }

  private renderSubmittedFiles() {
    console.log(this.state.submittedFiles);
    return this.state.submittedFiles.map((item, idx) => {
      const status = this.state.fileStatus[idx];
      return (
        this.shouldShow(status) &&
        <div key={idx} className={`attachmentRow ${this.statusClass[status]}`}>
          <Link href={item.s3ResourceURL} target="_blank">
            <Box fontSize={'14px'} display={'flex'}>
              <CheckIcon style={{ width: '14px', height: '14px' }} /> {item.fileName || item.name}
              </Box>
          </Link>
          <div className="options">
            <FileProgress id={idx} uploader={this.uploader} />
            <Filesize id={idx} uploader={this.uploader} />
            {this.canRetry(idx) &&
              <span className="retryUpload" onClick={() => this.uploader.methods.retry(idx)}></span>
            }
            {!this.props.attachmentDisabled &&
            <span className="deleteIcon" onClick={() => this.deleteFile(idx)}><DeleteIcon /></span>}
          </div>
        </div>
      );
    });
  }

  public render(): JSX.Element {
    return (
      <div className="Controlled Input FilesInputContainer">
        {this.props.label &&
          <Box fontSize={'14px'} fontWeight={600}>
          {this.props.label}
            <br />
            {this.props.sizeLimitLabel &&
              <span className={`subLabel ${this.state.hasFileSizeExcededError && 'hasError'}`}>
                {this.props.sizeLimitLabel}
              </span>}
          </Box>
        }
        <div className={`Controlled Input ${this.props.className || ''}`}>
          {this.props.defaultFiles && this.props.defaultFiles.map(({ id, name }) => (
            <div key={id} className='attachmentRow successful'>
              <span><a target="_blank" onClick={() => this.props.onDefaultFileClick(id)}>{name}</a></span>
            </div>
          ))}
            <Dropzone style={{ border: '1px dotted', height: 200, width: 200 }}
              uploader={this.uploader}>
              {this.renderSubmittedFiles()}
            {!this.props.attachmentDisabled && <FileInput
                uploader={this.uploader} multiple={true}
                accept={ALLOWED_EXTENSIONS.map((e) => `.${e}`).join(',')}>
                <span style={{ display: 'flex' }}><AttachmentIcon />{this.props.chooseFileLabel}</span>
            </FileInput> }
            </Dropzone>
          <ProgressBar uploader={this.uploader} />
        </div>
      </div>
    );
  }
}
