import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import styles from '../../css/TaskPage/TasksTable.module.css';

const TasksTable = ({ tasks, loading }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getPriorityValue = (priority) => {
        // Числовое значение для сортировки: low < medium < high
        switch (priority) {
            case 'low':
                return 1;
            case 'medium':
                return 2;
            case 'high':
                return 3;
            default:
                return 0;
        }
    };

    const getSortedTasks = () => {
        if (!tasks || tasks.length === 0) return [];
        if (!sortConfig.key) return tasks;

        return [...tasks].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Специальная обработка для приоритета
            if (sortConfig.key === 'priority') {
                aValue = getPriorityValue(aValue);
                bValue = getPriorityValue(bValue);
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
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
                    <th onClick={() => handleSort('task_id')}>
                        ID <SortIcon columnKey="task_id" />
                    </th>
                    <th onClick={() => handleSort('title')}>
                        Название <SortIcon columnKey="title" />
                    </th>
                    <th onClick={() => handleSort('user_id')}>
                        Исполнитель <SortIcon columnKey="user_id" />
                    </th>
                    <th onClick={() => handleSort('priority')}>
                        Приоритет <SortIcon columnKey="priority" />
                    </th>
                    <th>
                        Параметры
                    </th>
                    <th onClick={() => handleSort('updated_at')}>
                        Обновлено <SortIcon columnKey="updated_at" />
                    </th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {sortedTasks.length === 0 ? (
                    <tr>
                        <td colSpan="7" className={styles.empty}>
                            Задачи не найдены
                        </td>
                    </tr>
                ) : (
                    sortedTasks.map((task) => (
                        <tr key={task.task_id}>
                            <td className={styles.idCell}>{task.task_id}</td>
                            <td className={styles.titleCell}>
                                <div className={styles.taskTitle}>{task.title}</div>
                                {task.description && (
                                    <div className={styles.taskDescription}>{task.description}</div>
                                )}
                            </td>
                            <td>{task.user_id}</td>
                            <td>
                                <StatusBadge priority={task.priority} />
                            </td>
                            <td>
                                <div className={styles.parametersCell}>
                                    {task.parameters && task.parameters.length > 0 ? (
                                        task.parameters.map((param, index) => (
                                            <span key={index} className={styles.parameterTag}>
                                                {param}
                                            </span>
                                        ))
                                    ) : (
                                        <span className={styles.noParameters}>-</span>
                                    )}
                                </div>
                            </td>
                            <td className={styles.dateCell}>
                                {formatDate(task.updated_at)}
                            </td>
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
