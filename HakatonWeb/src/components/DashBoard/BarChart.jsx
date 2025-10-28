import React from 'react';
import '../../css/DashBoard/BarChart.css';

const BarChart = ({ title, data }) => {
    return (
        <div className="chart-card">
            <div className="chart-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
                <h3 className="chart-title">{title}</h3>
            </div>
            <div className="bar-chart">
                {data.map((item, index) => (
                    <div key={index} className="bar-wrapper">
                        <div className="bar" style={{ height: item.height }}></div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BarChart;
