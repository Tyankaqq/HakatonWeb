// Обновленный ExecutorPage.jsx с EditExecutorModal
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/ExecutorsPage/StatsCard';
import PerformersTable from '../components/ExecutorsPage/PerformersTable';
import AddExecutorModal from '../components/ExecutorsPage/AddExecutorModal';
import EditExecutorModal from '../components/ExecutorsPage/EditExecutorModal';
import SearchInput from '../components/ExecutorsPage/SearchInput';
import styles from '../css/ExecutorsPage/ExecutorsPage.module.css';

const BASE_URL = 'https://a4b0ae7793b5.ngrok-free.app/api/v1';

const ExecutorPage = () => {
    const [performers, setPerformers] = useState([]);
    const [filteredPerformers, setFilteredPerformers] = useState([]);
    const [stats, setStats] = useState({
        totalPerformers: 0,
        activeNow: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedExecutorId, setSelectedExecutorId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPerformers();
    }, [searchQuery, performers]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
            });

            if (!response.ok) throw new Error('Ошибка получения пользователей');

            const data = await response.json();
            let users = [];
            if (data.success && Array.isArray(data.data)) {
                users = data.data;
            } else if (Array.isArray(data)) {
                users = data;
            }

            const formattedPerformers = users.map(user => ({
                id: user.id?.toString(),
                initials: `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                email: user.email || 'N/A',
                role: 'Исполнитель',
                status: user.status ? 'Активен' : 'Неактивен',
                totalTasks: user.tasks_count || 0,
                completed: 0,
                inProgress: user.tasks_count || 0,
                productivity: 0,
                lastActivity: new Date(),
                skills: [],
                weight: user.weight || 0  // Добавляем вес
            }));

            setPerformers(formattedPerformers);
            setFilteredPerformers(formattedPerformers);

            const activeCount = users.filter(u => u.status).length;
            setStats({
                totalPerformers: users.length,
                activeNow: activeCount
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
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Ошибка создания исполнителя');

            await loadData();
            setModalOpen(false);
            alert('Исполнитель успешно добавлен');
        } catch (error) {
            console.error('Ошибка добавления исполнителя:', error);
            alert('Ошибка при добавлении исполнителя');
        }
    };

    const handleEditPerformer = async () => {
        await loadData();
        setEditModalOpen(false);
        alert('Исполнитель успешно обновлен');
    };

    const openEditModal = (executorId) => {
        setSelectedExecutorId(executorId);
        setEditModalOpen(true);
    };

    return (
        <div className={styles.container}>
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
            />
        </div>
    );
};

export default ExecutorPage;
