import React, { useState, useEffect } from 'react';
import StatsCard from '../components/ExecutorsPage/StatsCard';
import PerformersTable from '../components/ExecutorsPage/PerformersTable';
import AddExecutorModal from '../components/ExecutorsPage//AddExecutorModal';
import SearchInput from '../components/ExecutorsPage/SearchInput';
import { getPerformers, getStats } from '../data/performersData';
import styles from '../css/ExecutorsPage/ExecutorsPage.module.css';

const ExecutorPage = () => {
    const [performers, setPerformers] = useState([]);
    const [filteredPerformers, setFilteredPerformers] = useState([]);
    const [stats, setStats] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterPerformers();
    }, [searchQuery, performers]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [performersData, statsData] = await Promise.all([
                getPerformers(),
                getStats()
            ]);
            setPerformers(performersData);
            setFilteredPerformers(performersData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
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

    const handleAddPerformer = (formData) => {
        const initials = formData.fullName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        const newPerformer = {
            id: Date.now().toString(),
            initials: initials,
            name: formData.fullName,
            email: formData.email,
            role: formData.role,
            status: 'Активен',
            totalTasks: 0,
            completed: 0,
            inProgress: 0,
            productivity: 0,
            lastActivity: new Date(),
            skills: formData.skills
        };

        setPerformers([...performers, newPerformer]);
        setModalOpen(false);

        if (stats) {
            setStats({
                ...stats,
                totalPerformers: stats.totalPerformers + 1,
                activeNow: stats.activeNow + 1
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Исполнители</h1>
            </div>

            {stats && (
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
                        title="Средняя загрузка"
                        value={`${stats.avgLoad}%`}
                        icon="gauge"
                        iconColor="#f59e0b"
                    />
                    <StatsCard
                        title="Завершено сегодня"
                        value={stats.completedToday}
                        icon="check"
                        iconColor="#22c55e"
                    />
                </div>
            )}

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
            />

            <AddExecutorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddPerformer}
            />
        </div>
    );
};

export default ExecutorPage;
