import React from 'react';
import SearchInput from './SeacrhInput.jsx';
import Dropdown from './Dropdown';
import styles from '../../css/TasksToolbar.module.css';

const TasksToolbar = ({
                          searchQuery,
                          setSearchQuery,
                          statusFilter,
                          setStatusFilter,
                          priorityFilter,
                          setPriorityFilter,
                          onExport,
                          onCreateTask
                      }) => {
    const statusOptions = [
        { value: '', label: 'Все статусы' },
        { value: 'Высокий', label: 'Высокий' },
        { value: 'Средний', label: 'Средний' },
        { value: 'Низкий', label: 'Низкий' }
    ];

    const priorityOptions = [
        { value: '', label: 'Все приоритеты' },
        { value: 'High Priority', label: 'High Priority' },
        { value: 'Medium Priority', label: 'Medium Priority' },
        { value: 'Low Priority', label: 'Low Priority' },
        { value: 'Integration Tasks', label: 'Integration Tasks' }
    ];

    return (
        <div className={styles.toolbar}>
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск задач..."
            />

            <Dropdown
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
            />

            <Dropdown
                options={priorityOptions}
                value={priorityFilter}
                onChange={setPriorityFilter}
            />

            <div className={styles.actions}>
                <button className={styles.btnOutline} onClick={onExport}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 11L4 7h2.5V1h3v6H12L8 11z" fill="currentColor"/>
                        <path d="M14 14H2v-2h12v2z" fill="currentColor"/>
                    </svg>
                    Excel
                </button>

                <button className={styles.btnPrimary} onClick={onCreateTask}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Создать задачу
                </button>
            </div>
        </div>
    );
};

export default TasksToolbar;