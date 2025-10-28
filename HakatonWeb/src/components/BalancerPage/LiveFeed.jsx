import React, { useState, useEffect } from 'react';
import TaskAssignment from './TaskAssignment';
import styles from '../../css/BalancerPage/LiveFeed.module.css';

const LiveFeed = ({ assignments, loading }) => {
    const [visibleAssignments, setVisibleAssignments] = useState([]);
    const [removingIds, setRemovingIds] = useState(new Set());
    const MAX_VISIBLE = 3;

    useEffect(() => {
        if (assignments.length === 0) {
            setVisibleAssignments([]);
            setRemovingIds(new Set());
            return;
        }

        // Берем только последние 3 задачи
        const newAssignments = assignments.slice(0, MAX_VISIBLE);

        // Находим задачи, которые нужно удалить
        const newIds = new Set(newAssignments.map(a => a.id));
        const toRemove = visibleAssignments.filter(a => !newIds.has(a.id));

        if (toRemove.length > 0) {
            // Добавляем ID задач на удаление
            setRemovingIds(new Set(toRemove.map(a => a.id)));

            // Удаляем элементы через 300ms (время анимации)
            setTimeout(() => {
                setVisibleAssignments(newAssignments);
                setRemovingIds(new Set());
            }, 300);
        } else {
            setVisibleAssignments(newAssignments);
        }
    }, [assignments]);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                    <span className={styles.liveDot}></span>
                    Live распределение задач
                </h2>
            </div>
            <div className={styles.cardContent}>
                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : visibleAssignments.length === 0 ? (
                    <div className={styles.empty}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                        </svg>
                        <p>Ожидание новых задач...</p>
                    </div>
                ) : (
                    <div className={styles.assignmentsList}>
                        {visibleAssignments.map((assignment, index) => (
                            <TaskAssignment
                                key={assignment.id}
                                assignment={assignment}
                                index={index}
                                isRemoving={removingIds.has(assignment.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveFeed;
