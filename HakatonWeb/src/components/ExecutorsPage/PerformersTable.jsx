import React, { useState } from 'react';
import StatusIndicator from './StatusIndicator';
import ProgressBar from './ProgressBar';
import styles from '../../css/ExecutorsPage/PerformersTable.module.css';

const PerformersTable = ({ performers, loading }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedPerformers = () => {
        if (!sortConfig.key) return performers;

        return [...performers].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);

        if (diff < 60) return `${diff} секунд назад`;
        if (diff < 3600) return `${Math.floor(diff / 60)} минут назад`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} часа назад`;
        return `${Math.floor(diff / 86400)} дней назад`;
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <span className={styles.sortIcon}>⇅</span>;
        }
        return sortConfig.direction === 'asc' ?
            <span className={styles.sortIcon}>↑</span> :
            <span className={styles.sortIcon}>↓</span>;
    };

    if (loading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    const sortedPerformers = getSortedPerformers();

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th onClick={() => handleSort('initials')}>
                        Исполнитель <SortIcon columnKey="initials" />
                    </th>
                    <th onClick={() => handleSort('status')}>
                        Статус <SortIcon columnKey="status" />
                    </th>
                    <th onClick={() => handleSort('totalTasks')}>
                        Всего задач <SortIcon columnKey="totalTasks" />
                    </th>
                    <th onClick={() => handleSort('completed')}>
                        Завершено <SortIcon columnKey="completed" />
                    </th>
                    <th onClick={() => handleSort('inProgress')}>
                        В работе <SortIcon columnKey="inProgress" />
                    </th>
                    <th onClick={() => handleSort('productivity')}>
                        Производительность <SortIcon columnKey="productivity" />
                    </th>
                    <th onClick={() => handleSort('lastActivity')}>
                        Последняя активность <SortIcon columnKey="lastActivity" />
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedPerformers.length === 0 ? (
                    <tr>
                        <td colSpan="7" className={styles.empty}>
                            Исполнители не найдены
                        </td>
                    </tr>
                ) : (
                    sortedPerformers.map((performer) => (
                        <tr key={performer.id}>
                            <td>
                                <div className={styles.performerCell}>
                                    <div className={styles.avatar}>{performer.initials}</div>
                                    <div className={styles.performerInfo}>
                                        <div className={styles.performerName}>{performer.name}</div>
                                        <div className={styles.performerEmail}>{performer.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <StatusIndicator status={performer.status} />
                            </td>
                            <td className={styles.numberCell}>{performer.totalTasks}</td>
                            <td className={styles.numberCell}>
                                <div className={styles.withIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    {performer.completed}
                                </div>
                            </td>
                            <td className={styles.numberCell}>
                                <div className={styles.withIcon}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    {performer.inProgress}
                                </div>
                            </td>
                            <td>
                                <div className={styles.progressCell}>
                                    <ProgressBar
                                        percentage={performer.productivity}
                                        label={`${performer.productivity}%`}
                                    />
                                </div>
                            </td>
                            <td className={styles.timeCell}>
                                {formatTimeAgo(performer.lastActivity)}
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PerformersTable;