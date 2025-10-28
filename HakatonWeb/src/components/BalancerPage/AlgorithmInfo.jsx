import React from 'react';
import styles from '../../css/BalancerPage/BalancerPage.module.css';

const AlgorithmInfo = () => {
    const algorithms = [
        {
            icon: 'zap',
            iconColor: '#3b82f6',
            title: 'Least Loaded',
            description: 'Задачи назначаются исполнителю с наименьшим количеством активных задач',
        },
        {
            icon: 'activity',
            iconColor: '#10b981',
            title: 'Round Robin',
            description: 'Равномерное распределение задач по всем доступным исполнителям',
        },
        {
            icon: 'trending',
            iconColor: '#a855f7',
            title: 'Priority Based',
            description: 'Высокоприоритетные задачи обрабатываются первыми',
        },
    ];

    const renderIcon = (icon, color) => {
        const iconProps = {
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: color,
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round"
        };

        switch (icon) {
            case 'zap':
                return (
                    <svg {...iconProps}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                );
            case 'activity':
                return (
                    <svg {...iconProps}>
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                );
            case 'trending':
                return (
                    <svg {...iconProps}>
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.algorithmCard}>
            <h2 className={styles.algorithmTitle}>Алгоритм балансировки</h2>
            <div className={styles.algorithmGrid}>
                {algorithms.map((algo, index) => (
                    <div key={index} className={styles.algorithmItem}>
                        <div className={styles.algorithmHeader}>
                            <div
                                className={styles.algorithmIcon}
                                style={{ backgroundColor: `${algo.iconColor}15` }}
                            >
                                {renderIcon(algo.icon, algo.iconColor)}
                            </div>
                            <h3 className={styles.algorithmItemTitle}>{algo.title}</h3>
                        </div>
                        <p className={styles.algorithmDescription}>{algo.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AlgorithmInfo;
