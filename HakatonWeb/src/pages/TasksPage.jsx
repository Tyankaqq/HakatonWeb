import React, { useState, useEffect } from 'react';
import TasksToolbar from '../components/TaskPage/TasksToolBar.jsx';
import TasksTable from '../components/TaskPage/TasksTable';
import { getTasks } from '../data/mockData';
import styles from '../css/TasksPage.module.css';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [searchQuery, statusFilter, priorityFilter, tasks]);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await getTasks();
            setTasks(data);
            setFilteredTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        // Поиск по всем полям
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.id.toLowerCase().includes(query) ||
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.assignee.toLowerCase().includes(query)
            );
        }

        // Фильтр по статусу
        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        // Фильтр по приоритету
        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const handleExport = () => {
        console.log('Export to Excel');
    };

    const handleCreateTask = () => {
        console.log('Create new task');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Задачи</h1>

            <TasksToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                onExport={handleExport}
                onCreateTask={handleCreateTask}
            />

            <TasksTable
                tasks={filteredTasks}
                loading={loading}
            />
        </div>
    );
};

export default TasksPage;