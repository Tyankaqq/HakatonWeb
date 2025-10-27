import React from 'react';
import StatsCard from '../components/BalancerPage/StatsCard';
import LiveFeed from '../components/BalancerPage/LiveFeed';
import ExecutorLoad from '../components/BalancerPage/ExecutorLoad';
import AlgorithmInfo from '../components/BalancerPage/AlgorithmInfo';
import { useBalancer } from '../hooks/useBalancer.js';
import styles from '../css/BalancerPage/BalancerPage.module.css';

const BalancerPage = () => {
    const { stats, assignments, executors, loading } = useBalancer();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Балансировщик</h1>

            {/* Stats Cards */}
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
                    value="98.7%"
                    subtitle="Успешных распределений"
                    icon="trending"
                    iconColor="#22c55e"
                />
            </div>

            {/* Main Content */}
            <div className={styles.mainGrid}>
                <LiveFeed assignments={assignments} loading={loading} />
                <ExecutorLoad executors={executors} />
            </div>

            {/* Algorithm Info */}
            <AlgorithmInfo />
        </div>
    );
};

export default BalancerPage;
