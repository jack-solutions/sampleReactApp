import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import { Box } from '@material-ui/core';
import styles from './Status.module.css';

interface StatusProps {
  selected: string;
  statuses: Array<{
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'inherit';
    icon: JSX.Element;
  }>;
  selectable: boolean;
}

const Status: React.FC<StatusProps> = ({ selected = null, statuses = [], selectable = true }) => {
  const selectedStatus = statuses.find((status) => status.label === selected);
  if (!selectedStatus) {
    return null;
  }
  const Icon = selectedStatus.icon;
  return (
    <Box component={'span'}>
      <span className={styles.statusLabel}>Status</span>
      <Chip
        size={'small'}
        color={selectedStatus.color}
        {...(Icon ? { icon: <Icon /> } : {})}
        label={selected}
      />
    </Box>
  );
};

export default Status;
