import React, { useState } from 'react';

import styles from '../../css/TasksTable.module.css';

const TasksTable = ({ tasks, loading }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedTasks = () => {
        if (!sortConfig.key) return tasks;

        return [...tasks].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    const sortedTasks = getSortedTasks();

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th onClick={() => handleSort('id')}>
                        ID <SortIcon columnKey="id" />
                    </th>
                    <th onClick={() => handleSort('title')}>
                        Название <SortIcon columnKey="title" />
                    </th>
                    <th onClick={() => handleSort('assignee')}>
                        Исполнитель <SortIcon columnKey="assignee" />
                    </th>
                    <th onClick={() => handleSort('status')}>
                        Статус <SortIcon columnKey="status" />
                    </th>
                    <th onClick={() => handleSort('priority')}>
                        Приоритет <SortIcon columnKey="priority" />
                    </th>
                    <th onClick={() => handleSort('queue')}>
                        Очередь <SortIcon columnKey="queue" />
                    </th>
                    <th onClick={() => handleSort('updatedAt')}>
                        Обновлено <SortIcon columnKey="updatedAt" />
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sortedTasks.length === 0 ? (
                    <tr>
                        <td colSpan="8" className={styles.empty}>
                            Задачи не найдены
                        </td>
                    </tr>
                ) : (
                    sortedTasks.map((task) => (
                        <tr key={task.id}>
                            <td className={styles.idCell}>{task.id}</td>
                            <td className={styles.titleCell}>
                                <div className={styles.taskTitle}>{task.title}</div>
                                <div className={styles.taskDescription}>{task.description}</div>
                            </td>
                            <td>{task.assignee}</td>

                            <td>{task.priority}</td>
                            <td>{task.queue}</td>
                            <td className={styles.dateCell}>{formatDate(task.updatedAt)}</td>
                            <td className={styles.actionsCell}>
                                <button className={styles.menuButton}>⋮</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TasksTable;