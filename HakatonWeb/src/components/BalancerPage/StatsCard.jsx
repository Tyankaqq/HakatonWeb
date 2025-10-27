import React from 'react';
import styles from '../../css/BalancerPage/BalancerPage.module.css';

const StatsCard = ({ title, value, subtitle, icon, iconColor }) => {
    const renderIcon = () => {
        const iconProps = {
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: iconColor,
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
            case 'clock':
                return (
                    <svg {...iconProps}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
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
        <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
                <span className={styles.statsCardTitle}>{title}</span>
                <div
                    className={styles.statsCardIcon}
                    style={{ backgroundColor: `${iconColor}15` }}
                >
                    {renderIcon()}
                </div>
            </div>
            <div className={styles.statsCardValue}>{value}</div>
            <p className={styles.statsCardSubtitle}>{subtitle}</p>
        </div>
    );
};

export default StatsCard;
