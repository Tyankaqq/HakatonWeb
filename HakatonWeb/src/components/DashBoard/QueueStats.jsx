import React from 'react';
import '../../css/DashBoard/QueueStats.css';

const QueueStats = ({ title, queues }) => {
    return (
        <div className="queues-card">
            <div className="card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                    <path d="M3 3h7v7H3z"/>
                    <path d="M14 3h7v7h-7z"/>
                    <path d="M14 14h7v7h-7z"/>
                    <path d="M3 14h7v7H3z"/>
                </svg>
                <h3 className="card-title">{title}</h3>
            </div>
            <div className="queues-list">
                {queues.map((queue, index) => (
                    <div key={index} className="queue-item">
                        <div className="queue-header">
                            <span className="queue-dot" style={{ backgroundColor: queue.color }}></span>
                            <span className="queue-name">{queue.name}</span>
                            <span className="queue-count">{queue.count} задач</span>
                        </div>
                        <div className="queue-progress-bar">
                            <div
                                className="queue-progress"
                                style={{ width: `${queue.progress}%`, backgroundColor: queue.color }}
                            ></div>
                        </div>
                        <span className="queue-label">Загрузка: {queue.progress}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QueueStats;
