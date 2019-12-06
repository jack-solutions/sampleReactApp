import * as React from 'react';
import { FilesInput } from '../../components/FilesInput/FilesInput';
import { assessmentAttachmentsUrl } from '../../api/assessment';
import { getToken } from '../../auth/authentication';
import { tl } from '../../components/translate';

const Attachment = ({ assessmentId, onfilesChange, readOnly = false }) => {
  return (
    <FilesInput endpoint={assessmentAttachmentsUrl(assessmentId)}
      deleteEndpoint={assessmentAttachmentsUrl(assessmentId)}
      authToken={getToken()}
      attachmentDisabled={readOnly}
      label={tl('attachments')}
      chooseFileLabel={tl('addAttachments')}
      onfilesChange={onfilesChange}
    />
  )
};

export default Attachment;