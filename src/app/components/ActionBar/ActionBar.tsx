import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import styles from './styles.module.css';

interface PropsType {
  actions: Array<{
    label: string | JSX.Element;
    action: () => void;
    Icon: JSX.Element;
  }>;
  onClose?: () => void;
}

const ActionBar = ({ actions, onClose }: PropsType) => {
  return (
    <div className={styles.root}>
      {actions.map(({ action, Icon, label }) => {
        return (
          <Tooltip
            key={label}
            PopperProps={{ disablePortal: true }}
            style={{ zIndex: 5002 }}
            onOpen={() => console.log('Tooltip open')}
            title={label}
          >
            <IconButton className={styles.button} onClick={action}>
              <Icon className={styles.icon} />
            </IconButton>
          </Tooltip>
        );
      })}
      {onClose && (
        <IconButton
          key={'closeIconBtn'}
          className={`${styles.button} ${styles.closeBtn}`}
          onClick={onClose}
        >
          <CloseIcon className={styles.icon}></CloseIcon>
        </IconButton>
      )}
    </div>
  );
};

export default ActionBar;
