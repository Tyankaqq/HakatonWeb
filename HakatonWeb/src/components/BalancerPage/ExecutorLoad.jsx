import React from 'react';
import styles from '../../css/BalancerPage/ExecutorLoad.module.css';

const ExecutorLoad = ({ executors }) => {
    const sortedExecutors = [...executors].sort((a, b) => b.tasksCount - a.tasksCount);

    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return styles.statusActive;
            case 'busy':
                return styles.statusBusy;
            case 'idle':
                return styles.statusIdle;
            default:
                return '';
        }
    };

    const getProgressWidth = (tasksCount) => {
        return Math.min((tasksCount / 10) * 100, 100);
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Загрузка исполнителей</h2>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.executorsList}>
                    {sortedExecutors.map((executor) => (
                        <div key={executor.id} className={styles.executorItem}>
                            <div className={styles.executorHeader}>
                                <div className={styles.executorInfo}>
                                    <span className={`${styles.statusDot} ${getStatusClass(executor.status)}`}></span>
                                    <div className={styles.avatar}>{executor.initials}</div>
                                    <span className={styles.executorName}>{executor.name}</span>
                                </div>
                                <span className={styles.taskCount}>{executor.tasksCount}</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${getProgressWidth(executor.tasksCount)}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExecutorLoad;
