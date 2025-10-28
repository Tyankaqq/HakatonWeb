import React, { useState, useEffect } from 'react';
import TasksToolbar from '../components/TaskPage/TasksToolbar';
import TasksTable from '../components/TaskPage/TasksTable';
import CreateTaskModal from '../components/TaskPage/CreateTaskModal';
import { getTasks } from '../data/mockData';
import styles from '../css/TaskPage/TasksPage.module.css';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [searchQuery, priorityFilter, tasks]);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await getTasks();
            setTasks(data || []);
            setFilteredTasks(data || []);
        } catch (error) {
            console.error('Error loading tasks:', error);
            setTasks([]);
            setFilteredTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        if (!tasks || tasks.length === 0) {
            setFilteredTasks([]);
            return;
        }

        let filtered = [...tasks];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(task =>
                task.task_id?.toLowerCase().includes(query) ||
                task.title?.toLowerCase().includes(query) ||
                task.description?.toLowerCase().includes(query) ||
                task.user_id?.toLowerCase().includes(query) ||
                task.parameters?.some(param => param.toLowerCase().includes(query))
            );
        }

        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const handleCreateTask = (formData) => {
        const newTask = {
            task_id: `TSK-${Math.floor(Math.random() * 10000)}`,
            title: formData.title,
            description: formData.description,
            priority: formData.priority,
            user_id: 'Не назначен',
            parameters: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        setTasks([newTask, ...tasks]);
        setModalOpen(false);
    };

    const handleExport = () => {
        console.log('Export to Excel');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Задачи</h1>

            <TasksToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                onExport={handleExport}
                onCreateTask={() => setModalOpen(true)}
            />

            <TasksTable
                tasks={filteredTasks}
                loading={loading}
            />

            <CreateTaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleCreateTask}
            />
        </div>
    );
};

export default TasksPage;
