import React from 'react';
import StatsCard from '../components/BalancerPage/StatsCard';
import LiveFeed from '../components/BalancerPage/LiveFeed';
import ExecutorLoad from '../components/BalancerPage/ExecutorLoad';
import AlgorithmInfo from '../components/BalancerPage/AlgorithmInfo';
import { useBalancer } from '../hooks/useBalancer.js';
import styles from '../css/BalancerPage/BalancerPage.module.css';

const BalancerPage = () => {
    const { stats, assignments, executors, loading } = useBalancer();

    // Расчет эффективности - если есть executor, значит задача успешно распределена
    const totalTasks = assignments.length;
    const successfulTasks = assignments.filter(assignment =>
        assignment.executor !== null && assignment.executor !== undefined
    ).length;
    const efficiency = totalTasks > 0 ? Math.round((successfulTasks / totalTasks) * 100) : 0;

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
