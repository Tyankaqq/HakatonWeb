// src/pages/BalancerPage.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/BalancerPage/StatsCard';
import ExecutorLoad from '../components/BalancerPage/ExecutorLoad';
import AlgorithmInfo from '../components/BalancerPage/AlgorithmInfo';
import { fetchAllUsers, fetchActiveUsersWorkload } from '../API/ExecutorsAPI/ExecutorsAPI.js';
import { fetchTasks } from '../API/TasksAPI/TasksAPI.js';
import styles from '../css/BalancerPage/BalancerPage.module.css';

const BalancerPage = () => {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState([]);
    const [executors, setExecutors] = useState([]);

    useEffect(() => {
        loadBalancerData();
    }, []);

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const loadBalancerData = async () => {
        try {
            setLoading(true);

            // Параллельная загрузка всех данных
            const [usersResponse, workloadResponse, tasksResponse] = await Promise.allSettled([
                fetchAllUsers(),
                fetchActiveUsersWorkload(),
                fetchTasks()
            ]);

            console.log('=== BALANCER API RESPONSES ===');
            console.log('Users:', usersResponse);
            console.log('Workload:', workloadResponse);
            console.log('Tasks:', tasksResponse);

            // Обработка пользователей
            let users = [];
            if (usersResponse.status === 'fulfilled') {
                const data = usersResponse.value;
                if (data.success && Array.isArray(data.data)) {
                    users = data.data;
                } else if (Array.isArray(data)) {
                    users = data;
                }
            }

            // Обработка workload
            let workload = [];
            if (workloadResponse.status === 'fulfilled') {
                const data = workloadResponse.value;
                if (data.success && Array.isArray(data.data)) {
                    workload = data.data;
                } else if (Array.isArray(data)) {
                    workload = data;
                }
            }

            // Обработка задач
            let tasks = [];
            if (tasksResponse.status === 'fulfilled') {
                const data = tasksResponse.value;
                console.log('Tasks raw data:', data);

                if (data.success && Array.isArray(data.data)) {
                    tasks = data.data;
                } else if (Array.isArray(data.data?.tasks)) {
                    tasks = data.data.tasks;
                } else if (Array.isArray(data.tasks)) {
                    tasks = data.tasks;
                } else if (Array.isArray(data)) {
                    tasks = data;
                }

                console.log('Parsed tasks:', tasks);
            } else {
                console.log('Tasks request failed:', tasksResponse.reason);
            }

            // Fallback на демо-данные если задач нет
            if (tasks.length === 0) {
                console.log('⚠️ Используем демо-данные для задач');
                tasks = [
                    { task_id: 'DEMO-1', title: 'Обработка заказов из CRM', user_id: null, priority: 'high', status: 'pending', execution_time_ms: 0 },
                    { task_id: 'DEMO-2', title: 'Синхронизация каталога товаров', user_id: null, priority: 'medium', status: 'completed', execution_time_ms: 0 },
                    { task_id: 'DEMO-3', title: 'Экспорт отчётов Excel', user_id: null, priority: 'low', status: 'pending', execution_time_ms: 0 },
                    { task_id: 'DEMO-4', title: 'Интеграция с платежной системой', user_id: null, priority: 'high', status: 'waiting', execution_time_ms: 0 },
                    { task_id: 'DEMO-5', title: 'Обновление данных через REST API', user_id: null, priority: 'medium', status: 'completed', execution_time_ms: 0 }
                ];
            }

            // Форматируем задачи
            const formattedTasks = tasks.slice(0, 5).map(task => {
                const executionTime = task.execution_time_ms !== null && task.execution_time_ms !== undefined
                    ? task.execution_time_ms
                    : 0;

                return {
                    id: task.task_id || task.id || 'N/A',
                    title: task.title || 'Без названия',
                    executionTime: `${executionTime}`
                };
            });

            console.log('Formatted tasks for balancer:', formattedTasks);

            // Формируем данные исполнителей с правильным полем tasksCount
            const executorsData = workload.map(worker => {
                const user = users.find(u => {
                    const fullName = `${u.first_name || ''} ${u.last_name || ''} ${u.middle_name || ''}`.trim().toLowerCase();
                    return fullName === (worker.full_name || '').toLowerCase();
                });

                return {
                    id: user?.id || worker.full_name,
                    name: worker.full_name,
                    initials: getInitials(worker.full_name),
                    tasksCount: worker.open_tasks_count || 0, // ✅ Используем tasksCount
                    tasksAssigned: worker.open_tasks_count || 0, // Для обратной совместимости
                    status: user?.status ? 'active' : 'idle',
                    weight: user?.weight || 1
                };
            });

            console.log('Executors data:', executorsData);
            setExecutors(executorsData);

            // Статистика
            const totalAssigned = executorsData.reduce((sum, ex) => sum + ex.tasksCount, 0);
            const activeExecutors = executorsData.filter(ex => ex.status === 'active').length;
            const efficiency = 100;

            setStatsData([
                {
                    title: 'Всего задач',
                    value: totalAssigned,
                    subtitle: 'У всех исполнителей',
                    icon: 'zap',
                    iconColor: '#3b82f6'
                },
                {
                    title: 'Активных исполнителей',
                    value: activeExecutors,
                    subtitle: `Из ${executorsData.length} всего`,
                    icon: 'activity',
                    iconColor: '#10b981'
                },
                {
                    title: 'Среднее время',
                    value: `${formattedTasks[0]?.executionTime ?? "0"} мс`,
                    subtitle: 'время выполнения',
                    icon: 'clock',
                    iconColor: '#f59e0b'
                },
                {
                    title: 'Эффективность',
                    value: `${efficiency}%`,
                    subtitle: 'Система работает',
                    icon: 'trending',
                    iconColor: '#10B981'
                }
            ]);

            setLoading(false);

        } catch (error) {
            console.error('Ошибка загрузки данных балансировщика:', error);
            setLoading(false);
        }
    };

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
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className={styles.mainGrid}>
                <ExecutorLoad executors={executors} />
                <AlgorithmInfo />
            </div>
        </div>
    );
};

export default BalancerPage;
