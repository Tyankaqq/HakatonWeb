import React from 'react';
import styles from '../../css/ExecutorsPage/PerformersTable.module.css';

const StatusIndicator = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Активен':
                return { color: '#10b981', label: 'Активен' };
            case 'Не в сети':
                return { color: '#94a3b8', label: 'Не в сети' };
            case 'Занят':
                return { color: '#f59e0b', label: 'Занят' };
            default:
                return { color: '#64748b', label: status };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className={styles.statusIndicator}>
      <span
          className={styles.statusDot}
          style={{ backgroundColor: config.color }}
      />
            <span className={styles.statusLabel}>{config.label}</span>
        </div>
    );
};

export default StatusIndicator;