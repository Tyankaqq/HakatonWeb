import React from 'react';
import '../../css/DashBoard/StatsCard.css';

const StatsCard = ({ title, value, change, changeType, subtitle, icon, color }) => {
    const getIcon = () => {
        switch (icon) {
            case 'tasks':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                );
            case 'users':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                );
            case 'clock':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                );
            case 'check':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="stat-card">
            <div className="stat-header">
                <span className="stat-title">{title}</span>
                <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
                    {getIcon()}
                </div>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-footer">
                <span className={`stat-change ${changeType}`}>{change}</span>
                <span className="stat-label">{subtitle}</span>
            </div>
        </div>
    );
};

export default StatsCard;
