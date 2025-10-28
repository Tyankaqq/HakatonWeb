// src/pages/BalancerPage.jsx
import React from 'react';
import StatsCard from '../components/BalancerPage/StatsCard';
import LiveFeed from '../components/BalancerPage/LiveFeed';
import ExecutorLoad from '../components/BalancerPage/ExecutorLoad';
import AlgorithmInfo from '../components/BalancerPage/AlgorithmInfo';
import { useBalancer } from '../hooks/useBalancer.js';
import styles from '../css/BalancerPage/BalancerPage.module.css';

const BalancerPage = () => {
    const { stats, executors, loading } = useBalancer();

    // Эффективность 100% так как данные статичные с бэкенда
    const efficiency = 100;

    // Средняя загрузка (задач на исполнителя)
    const avgTasksPerExecutor = executors.length > 0
        ? Math.round(stats.totalAssigned / executors.length)
        : 0;

    // Симуляция среднего времени обработки в мс
    // Формула: среднее количество задач * примерное время на задачу (например, 150мс)
    const avgProcessingTime = executors.length > 0
        ? Math.round((stats.totalAssigned / executors.length) * 20) // 150мс на задачу
        : 0;

    // Или можно рассчитать по-другому: общее время / количество задач
    const totalEstimatedTime = stats.totalAssigned * 20; // примерное время всех задач
    const avgTimePerTask = stats.totalAssigned > 0
        ? Math.round(totalEstimatedTime / stats.totalAssigned)
        : 0;

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
                    title="Всего задач"
                    value={stats.totalAssigned}
                    subtitle="У всех исполнителей"
                    icon="zap"
                    iconColor="#3b82f6"
                />
                <StatsCard
                    title="Активных исполнителей"
                    value={executors.filter(ex => ex.status === 'active').length}
                    subtitle={`Из ${executors.length} всего`}
                    icon="activity"
                    iconColor="#10b981"
                />
                <StatsCard
                    title="Среднее время"
                    value={`${avgProcessingTime} мс`}
                    subtitle="обработки на исполнителя"
                    icon="clock"
                    iconColor="#f59e0b"
                />
                <StatsCard
                    title="Эффективность"
                    value={`${efficiency}%`}
                    subtitle="Система работает"
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
