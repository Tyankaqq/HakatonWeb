// src/components/ExecutorsPage/PerformersTable.jsx
import React, { useState } from 'react';
import StatusIndicator from './StatusIndicator';
import styles from '../../css/components/ExecutorsTable.module.css';
import DeleteIcon from '../../assets/Image/DeleteIcon.svg';
import EditLogo from '../../assets/Image/EditLogo.svg';
const PerformersTable = ({ performers, loading, onEdit, onDelete }) => {
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

    const getLevel = (weight) => {
        if (!weight) return 'Не указан';
        if (weight >= 1 && weight <= 3) return 'Junior';
        if (weight >= 4 && weight <= 6) return 'Middle';
        if (weight >= 7 && weight <= 10) return 'Senior';
        return 'Неизвестный';
    };

    const getLevelBadgeStyle = (level) => {
        switch (level) {
            case 'Junior':
                return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
            case 'Middle':
                return { backgroundColor: '#FEF3C7', color: '#92400E' };
            case 'Senior':
                return { backgroundColor: '#D1FAE5', color: '#065F46' };
            default:
                return { backgroundColor: '#F3F4F6', color: '#6B7280' };
        }
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
                    <th onClick={() => handleSort('weight')}>
                        Уровень <SortIcon columnKey="weight" />
                    </th>
                    <th>
                        Действия
                    </th>
                </tr>
                </thead>
                <tbody>
                {sortedPerformers.length === 0 ? (
                    <tr>
                        <td colSpan="5" className={styles.empty}>
                            Исполнители не найдены
                        </td>
                    </tr>
                ) : (
                    sortedPerformers.map((performer) => {
                        const level = getLevel(performer.weight);
                        const levelStyle = getLevelBadgeStyle(level);

                        return (
                            <tr key={performer.id}>
                                <td>
                                    <div className={styles.performerCell}>
                                        <div className={styles.avatar}>{performer.initials}</div>
                                        <div className={styles.performerInfo}>
                                            <div className={styles.performerName}>{performer.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <StatusIndicator status={performer.status} />
                                </td>
                                <td className={styles.numberCell}>{performer.totalTasks}</td>
                                <td>
                                    <span
                                        className={styles.levelBadge}
                                        style={levelStyle}
                                    >
                                        {level}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionsCell}>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => onEdit(performer.id)}
                                            title="Редактировать"
                                        >
                                        <img src={EditLogo} width="24" height="24" />
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => onDelete(performer.id, performer.name)}
                                            title="Удалить"
                                        >
                                            <img src={DeleteIcon}  width="24" height="24" alt="" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PerformersTable;
