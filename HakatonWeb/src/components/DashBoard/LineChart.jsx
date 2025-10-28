import React from 'react';
import '../../css/DashBoard/LineChart.css';

const LineChart = ({ title }) => {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                </svg>
                <h3 className="chart-title">{title}</h3>
            </div>
            <svg className="line-chart" viewBox="0 0 400 150">
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    points="20,120 80,130 140,40 200,20 260,30 320,100"
                />
                <circle cx="20" cy="120" r="4" fill="#10b981"/>
                <circle cx="80" cy="130" r="4" fill="#10b981"/>
                <circle cx="140" cy="40" r="4" fill="#10b981"/>
                <circle cx="200" cy="20" r="4" fill="#10b981"/>
                <circle cx="260" cy="30" r="4" fill="#10b981"/>
                <circle cx="320" cy="100" r="4" fill="#10b981"/>
            </svg>
        </div>
    );
};

export default LineChart;
