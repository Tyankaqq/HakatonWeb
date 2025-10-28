import React from 'react';
import SearchInput from './SeacrhInput.jsx';
import Dropdown from './Dropdown';
import styles from '../../css/TaskPage/TasksToolbar.module.css';

const TasksToolbar = ({
                          searchQuery,
                          setSearchQuery,
                          priorityFilter,
                          setPriorityFilter,
                          onExport,
                          onCreateTask
                      }) => {
    const priorityOptions = [
        { value: '', label: 'Все приоритеты' },
        { value: 'high', label: 'Высокий' },
        { value: 'medium', label: 'Средний' },
        { value: 'low', label: 'Низкий' }
    ];

    return (
        <div className={styles.toolbar}>
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск задач..."
            />

            <Dropdown
                options={priorityOptions}
                value={priorityFilter}
                onChange={setPriorityFilter}
                placeholder="Все приоритеты"
            />

            <div className={styles.actions}>
                <button className={styles.btnOutline} onClick={onExport}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 11L4 7h2.5V1h3v6H12L8 11z" fill="currentColor"/>
                        <path d="M14 14H2v-2h12v2z" fill="currentColor"/>
                    </svg>
                    Excel
                </button>


            </div>
        </div>
    );
};

export default TasksToolbar;
