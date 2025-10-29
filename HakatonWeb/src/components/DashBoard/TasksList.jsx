import React from 'react';
import '../../css/DashBoard/TasksList.css';
import pendingLogo from '../../assets/Image/MistakeLogo.svg';

const TasksList = ({ title, tasks }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                );
            case 'completed':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                );
            case 'waiting':
                return (
                    <img src={pendingLogo} alt="" />
                );
            default:
                return null;
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high':
                return 'high';
            case 'medium':
                return 'medium';
            case 'low':
                return 'low';
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

    const getIconClass = (status) => {
        switch (status) {
            case 'completed':
                return 'green';
            case 'pending':
                return 'orange';
            case 'waiting':
                return 'gray';
            default:
                return '';
        }
    };

    return (
        <div className="tasks-card">
            <div className="card-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"/>
                    <line x1="8" y1="12" x2="21" y2="12"/>
                    <line x1="8" y1="18" x2="21" y2="18"/>
                    <line x1="3" y1="6" x2="3.01" y2="6"/>
                    <line x1="3" y1="12" x2="3.01" y2="12"/>
                    <line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
                <h3 className="card-title">{title}</h3>
            </div>
            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <div>
                        Пока что ничего нет.
                    </div>
                ) : (
                    <>
                        {tasks.map((task, index) => (
                            <div key={index} className="task-item">
                                <div className="task-info">
                                    <div className="task-header">
                                        <span className="task-id">{task.id}</span>
                                        <span className={`task-badge ${getPriorityClass(task.priority)}`}>
                                    {getPriorityLabel(task.priority)}
                                </span>
                                    </div>
                                    <div className="task-title">{task.title}</div>
                                    <div className="task-assignee">{task.assignee}</div>
                                </div>
                                <div className={`task-icon ${getIconClass(task.status)}`}>
                                    {getStatusIcon(task.status)}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default TasksList;
