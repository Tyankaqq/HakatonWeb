import React from 'react';
import styles from '../../css/TaskPage/TasksTable.module.css';

const StatusBadge = ({ priority }) => {
    const getPriorityConfig = (priority) => {
        switch (priority) {
            case 'high':
                return {
                    color: '#dc2626',
                    bgColor: '#fef2f2',
                    borderColor: '#fecaca',
                    label: 'Высокий'
                };
            case 'medium':
                return {
                    color: '#2563eb',
                    bgColor: '#eff6ff',
                    borderColor: '#bfdbfe',
                    label: 'Средний'
                };
            case 'low':
                return {
                    color: '#6b7280',
                    bgColor: '#f9fafb',
                    borderColor: '#e5e7eb',
                    label: 'Низкий'
                };
            default:
                return {
                    color: '#64748b',
                    bgColor: '#f1f5f9',
                    borderColor: '#e2e8f0',
                    label: priority || '-'
                };
        }
    };

    const config = getPriorityConfig(priority);

    return (
        <span
            className={styles.priorityBadge}
            style={{
                color: config.color,
                backgroundColor: config.bgColor,
                borderColor: config.borderColor
            }}
        >
            {config.label}
        </span>
    );
};

export default StatusBadge;
