// src/pages/ExecutorPage.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/ExecutorsPage/StatsCard';
import PerformersTable from '../components/ExecutorsPage/PerformersTable';
import AddExecutorModal from '../components/ExecutorsPage/AddExecutorModal';
import EditExecutorModal from '../components/ExecutorsPage/EditExecutorModal';
import SearchInput from '../components/ExecutorsPage/SearchInput';
import Toast from '../components/Toast';
import { fetchAllUsers, createUser, deleteUser } from '../API/ExecutorsAPI/ExecutorsAPI.js';
import styles from '../css/ExecutorsPage/ExecutorsPage.module.css';

const ExecutorPage = () => {
    const [performers, setPerformers] = useState([]);
    const [filteredPerformers, setFilteredPerformers] = useState([]);
    const [stats, setStats] = useState({
        totalPerformers: 0,
        activeNow: 0,
        totalTasks: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExecutorId, setSelectedExecutorId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPerformers();
    }, [searchQuery, performers]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUsers();
            console.log('=== EXECUTOR PAGE API Response ===', response);

            let users = [];
            // Обрабатываем разные структуры ответа
            if (response.success && Array.isArray(response.data)) {
                users = response.data;
            } else if (Array.isArray(response)) {
                users = response;
            } else if (response.data && Array.isArray(response.data)) {
                users = response.data;
            }

            console.log('Parsed users:', users);

            const formattedPerformers = users.map(user => {
                // Пробуем разные варианты поля с количеством задач
                const taskCount = user.tasks_count || user.taskCount || user.task_count || 0;

                console.log(`User ${user.id}: tasks_count = ${taskCount}`, user);

                return {
                    id: user.id?.toString(),
                    initials: `${user.first_name?.[0] || '?'}${user.last_name?.[0] || '?'}`,
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Без имени',
                    email: user.email || 'N/A',
                    role: 'Исполнитель',
                    status: user.status ? 'Активен' : 'Неактивен',
                    totalTasks: taskCount,
                    completed: 0,
                    inProgress: taskCount,
                    productivity: 0,
                    lastActivity: new Date(),
                    skills: [],
                    weight: user.weight || 0
                };
            });

            setPerformers(formattedPerformers);
            setFilteredPerformers(formattedPerformers);

            // Подсчет статистики
            const activeCount = users.filter(u => u.status).length;
            const totalTasksCount = formattedPerformers.reduce((sum, performer) => sum + performer.totalTasks, 0);

            console.log('=== STATS ===');
            console.log('Total performers:', users.length);
            console.log('Active:', activeCount);
            console.log('Total tasks:', totalTasksCount);

            setStats({
                totalPerformers: users.length,
                activeNow: activeCount,
                totalTasks: totalTasksCount
            });

            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setPerformers([]);
            setFilteredPerformers([]);
            setLoading(false);
        }
    };

    const filterPerformers = () => {
        if (!searchQuery) {
            setFilteredPerformers(performers);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = performers.filter(performer =>
            performer.name.toLowerCase().includes(query) ||
            performer.email.toLowerCase().includes(query) ||
            performer.initials.toLowerCase().includes(query)
        );
        setFilteredPerformers(filtered);
    };

    const handleAddPerformer = async (formData) => {
        try {
            console.log('Данные для создания:', formData);

            const result = await createUser(formData);

            console.log('Результат создания:', result);

            await loadData();
            setModalOpen(false);

            showToast('Исполнитель успешно добавлен! 🎉', 'success');
        } catch (error) {
            console.error('Ошибка добавления исполнителя:', error);
            showToast(`Ошибка: ${error.message}`, 'error');
        }
    };

    const handleEditPerformer = async () => {
        await loadData();
        setEditModalOpen(false);
    };

    const handleDeletePerformer = async (executorId, executorName) => {
        const confirmed = window.confirm(
            `Вы уверены, что хотите удалить исполнителя "${executorName}"?\n\nЭто действие нельзя отменить.`
        );

        if (!confirmed) return;

        try {
            console.log('Удаление исполнителя:', executorId);

            await deleteUser(executorId);

            await loadData();

            showToast(`Исполнитель "${executorName}" успешно удален`, 'success');
        } catch (error) {
            console.error('Ошибка удаления исполнителя:', error);
            showToast(`Ошибка удаления: ${error.message}`, 'error');
        }
    };

    const openEditModal = (executorId) => {
        setSelectedExecutorId(executorId);
        setEditModalOpen(true);
    };

    return (
        <div className={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <div className={styles.header}>
                <h1 className="modalHeader">Исполнители</h1>
            </div>

            <div className={styles.statsGrid}>
                <StatsCard
                    title="Всего исполнителей"
                    value={stats.totalPerformers}
                    icon="users"
                    iconColor="#3b82f6"
                />
                <StatsCard
                    title="Активных сейчас"
                    value={stats.activeNow}
                    icon="activity"
                    iconColor="#10b981"
                />
                <StatsCard
                    title="Всего задач"
                    value={stats.totalTasks}
                    icon="tasks"
                    iconColor="#f59e0b"
                />
            </div>

            <div className={styles.toolbar}>
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Поиск исполнителя..."
                />
                <button className={styles.addButton} onClick={() => setModalOpen(true)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Добавить исполнителя
                </button>
            </div>

            <PerformersTable
                performers={filteredPerformers}
                loading={loading}
                onEdit={openEditModal}
                onDelete={handleDeletePerformer}
            />

            <AddExecutorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddPerformer}
            />

            <EditExecutorModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSubmit={handleEditPerformer}
                executorId={selectedExecutorId}
                showToast={showToast}
            />
        </div>
    );
};

export default ExecutorPage;
