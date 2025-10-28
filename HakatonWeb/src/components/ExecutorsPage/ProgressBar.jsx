import React from 'react';
import styles from '../../css/components/ExecutorsTable.module.css';

const ProgressBar = ({ percentage, label }) => {
    const getColor = (value) => {
        if (value >= 90) return '#10b981'; // green
        if (value >= 75) return '#3b82f6'; // blue
        if (value >= 50) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    const color = getColor(percentage);

    return (
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color
                    }}
                />
            </div>
            <span className={styles.progressLabel}>{label}</span>
        </div>
    );
};

export default ProgressBar;