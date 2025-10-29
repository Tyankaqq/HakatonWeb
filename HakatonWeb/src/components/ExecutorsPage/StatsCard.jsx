import React from 'react';
import styles from '../../css/components/StatsCard.module.css';
import ClockLogo from '../../assets/Image/ClockLogo.svg';

const StatsCard = ({ title, value, icon, iconColor }) => {
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
            case 'users':
                return (
                    <svg {...iconProps}>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                );
            case 'activity':
                return (
                    <svg {...iconProps}>
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                );
            case 'gauge':
                return (
                    <svg {...iconProps}>
                        <path d="M12 2v4"/>
                        <path d="m6.8 15-3.5 2"/>
                        <path d="m20.7 7-3.5 2"/>
                        <path d="M6.8 9 3.3 7"/>
                        <path d="m20.7 17-3.5-2"/>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="m15 9-3 3-3-3"/>
                    </svg>
                );
            case 'check':
                return (
                    <svg {...iconProps}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                );
            case 'tasks':
                return (
                    <svg {...iconProps}>
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="9 12 11 14 15 10"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>{title}</span>
                <div className={styles.iconContainer} style={{ backgroundColor: `${iconColor}15` }}>
                    {renderIcon()}
                </div>
            </div>
            <div className={styles.cardValue}>{value}</div>
        </div>
    );
};

export default StatsCard;
