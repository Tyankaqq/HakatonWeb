// src/pages/BalancerPage.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/BalancerPage/StatsCard';
import LiveFeed from '../components/BalancerPage/LiveFeed';
import ExecutorLoad from '../components/BalancerPage/ExecutorLoad';
import AlgorithmInfo from '../components/BalancerPage/AlgorithmInfo';
import styles from '../css/BalancerPage/BalancerPage.module.css';

const BASE_URL = 'https://a4b0ae7793b5.ngrok-free.app/api/v1';

const BalancerPage = () => {
    const [executors, setExecutors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssigned: 0,
        lastMinute: 0,
        avgTime: 0,
    });

    // Загрузка исполнителей из API
    useEffect(() => {
        const loadExecutors = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                });

                if (!response.ok) throw new Error('Ошибка получения пользователей');

                const data = await response.json();
                console.log('API Response:', data);

                // Обработка ответа
                let users = [];
                if (data.success && Array.isArray(data.data)) {
                    users = data.data;
                } else if (Array.isArray(data)) {
                    users = data;
                }

                // Форматируем данные для компонента ExecutorLoad
                const formattedExecutors = users.map(user => ({
                    id: user.id?.toString() || Math.random().toString(),
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                    initials: `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`,
                    tasksCount: user.tasks_count || 0,
                    status: user.status ? 'active' : 'inactive',
                }));

                setExecutors(formattedExecutors);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки исполнителей:', error);
                setExecutors([]);
                setLoading(false);
            }
        };

        loadExecutors();
    }, []);

    // Расчет эффективности - если нет задач, показываем 0%
    const totalTasks = assignments.length;
    const successfulTasks = assignments.filter(assignment =>
        assignment.executor !== null && assignment.executor !== undefined
    ).length;
    const efficiency = totalTasks > 0 ? Math.round((successfulTasks / totalTasks) * 100) : 0;

    if (loading) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>Балансировщик</h1>
                <div className={styles.loading}>Загрузка данных...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Балансировщик</h1>

            <div className={styles.statsGrid}>
                <StatsCard
                    title="Распределено задач"
                    value={stats.totalAssigned}
                    subtitle="С момента запуска"
                    icon="zap"
                    iconColor="#3b82f6"
                />
                <StatsCard
                    title="За последнюю минуту"
                    value={stats.lastMinute}
                    subtitle="задач/мин"
                    icon="activity"
                    iconColor="#10b981"
                />
                <StatsCard
                    title="Среднее время"
                    value={`${stats.avgTime.toFixed(1)} сек`}
                    subtitle="На распределение"
                    icon="clock"
                    iconColor="#f59e0b"
                />
                <StatsCard
                    title="Эффективность"
                    value={`${efficiency}%`}
                    subtitle="Успешные распределения"
                    icon="trending"
                    iconColor="#10B981"
                />
            </div>

            <div className={styles.mainGrid}>
                <ExecutorLoad executors={executors} />
                <AlgorithmInfo />
            </div>
        </div>
    );
};

export default BalancerPage;
