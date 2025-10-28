import React, { useState, useEffect } from 'react';
import styles from '../../css/BalancerPage/TaskAssignment.module.css';

const TaskAssignment = ({ assignment, index, isRemoving }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showArrow, setShowArrow] = useState(false);
    const [showExecutor, setShowExecutor] = useState(false);
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        // Анимация появления элемента только для новых элементов
        if (!isRemoving) {
            const timer1 = setTimeout(() => setIsVisible(true), 50);
            const timer2 = setTimeout(() => setShowArrow(true), 200);
            const timer3 = setTimeout(() => setShowExecutor(true), 300);
            const timer4 = setTimeout(() => setShowCheck(true), 500);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
            };
        }
    }, [isRemoving]);

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high':
                return styles.priorityHigh;
            case 'medium':
                return styles.priorityMedium;
            case 'low':
                return styles.priorityLow;
            default:
                return '';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high':
                return 'Высокий';
            case 'medium':
                return 'Средний';
            case 'low':
                return 'Низкий';
            default:
                return priority;
        }
    };

    return (
        <div className={`${styles.assignment} ${isVisible ? styles.visible : ''} ${isRemoving ? styles.removing : ''}`}>
            {/* Task Info */}
            <div className={styles.taskInfo}>
                <div className={styles.taskHeader}>
                    <span className={`${styles.priorityBadge} ${getPriorityClass(assignment.task.priority)}`}>
                        {getPriorityLabel(assignment.task.priority)}
                    </span>
                    <span className={styles.taskId}>{assignment.task.id}</span>
                </div>
                <p className={styles.taskTitle}>{assignment.task.title}</p>
                <p className={styles.taskQueue}>{assignment.task.queue}</p>
            </div>

            {/* Arrow */}
            <div className={`${styles.arrow} ${showArrow ? styles.visible : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                </svg>
            </div>

            {/* Executor Info */}
            <div className={`${styles.executorInfo} ${showExecutor ? styles.visible : ''}`}>
                <div className={styles.avatar}>{assignment.executor.initials}</div>
                <div className={styles.executorDetails}>
                    <p className={styles.executorName}>{assignment.executor.name}</p>
                    <p className={styles.timestamp}>{assignment.task.timestamp}</p>
                </div>
            </div>

            {/* Success Check */}
            <div className={`${styles.checkIcon} ${showCheck ? styles.visible : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            </div>
        </div>
    );
};

export default TaskAssignment;
