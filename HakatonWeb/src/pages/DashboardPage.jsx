// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import BarChart from '../components/Dashboard/BarChart';
import LineChart from '../components/Dashboard/LineChart';
import TasksList from '../components/Dashboard/TasksList';
import Toast from '../components/Toast';
import { fetchAllUsers, fetchActiveUsersWorkload } from '../API/ExecutorsAPI/ExecutorsAPI.js';
import '../css/DashBoard/DashBoardPage.css';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState([
        { title: 'Всего задач', value: '0', changeType: 'positive', subtitle: 'за последнюю неделю', icon: 'tasks', color: '#3b82f6' },
        { title: 'Активных исполнителей', value: '0', changeType: 'positive', subtitle: 'за последнюю неделю', icon: 'users', color: '#10b981' },
        { title: 'Средняя загрузка', value: '0 мс', changeType: 'positive', subtitle: 'время на задачу', icon: 'check', color: '#22c55e' }
    ]);
    const [barData, setBarData] = useState([]);
    const [toast, setToast] = useState(null);

    const tasksData = [
        { id: 'TSK-4721', title: 'Обработка заказов из CRM', assignee: 'Иванов А.П.', priority: 'high', status: 'pending' },
        { id: 'TSK-4720', title: 'Синхронизация каталога товаров', assignee: 'Петрова М.С.', priority: 'medium', status: 'completed' },
        { id: 'TSK-4719', title: 'Экспорт отчётов Excel', assignee: 'Сидоров К.В.', priority: 'low', status: 'pending' },
        { id: 'TSK-4718', title: 'Интеграция с платежной системой', assignee: 'Козлова Н.И.', priority: 'high', status: 'waiting' },
        { id: 'TSK-4717', title: 'Обновление данных через REST API', assignee: 'Морозов Д.А.', priority: 'medium', status: 'completed' }
    ];

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    const getLevel = (weight) => {
        if (weight >= 1 && weight <= 3) return 'Junior';
        if (weight >= 4 && weight <= 6) return 'Middle';
        if (weight >= 7 && weight <= 10) return 'Senior';
        return 'Junior';
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const [usersResponse, workloadResponse] = await Promise.all([
                fetchAllUsers(),
                fetchActiveUsersWorkload()
            ]);

            console.log('=== RAW API RESPONSES ===');
            console.log('Users Response:', usersResponse);
            console.log('Workload Response:', workloadResponse);

            let users = [];
            if (usersResponse.success && Array.isArray(usersResponse.data)) {
                users = usersResponse.data;
            } else if (Array.isArray(usersResponse)) {
                users = usersResponse;
            }

            let workload = [];
            if (workloadResponse.success && Array.isArray(workloadResponse.data)) {
                workload = workloadResponse.data;
            }

            console.log('=== PROCESSED DATA ===');
            console.log('Users array:', users);
            console.log('Workload array:', workload);

            // Улучшенное сопоставление - убираем все лишние пробелы и приводим к нижнему регистру
            const userMap = new Map();
            users.forEach(user => {
                // Собираем полное ФИО с отчеством
                const parts = [
                    user.first_name || '',
                    user.last_name || '',
                    user.middle_name || ''
                ].filter(part => part.trim() !== ''); // Убираем пустые части

                const fullName = parts.join(' ').trim().replace(/\s+/g, ' ').toLowerCase();
                userMap.set(fullName, user);
                console.log(`User mapped: "${fullName}" -> weight: ${user.weight}, level: ${getLevel(user.weight)}`);
            });

            let juniorTasks = 0;
            let middleTasks = 0;
            let seniorTasks = 0;

            console.log('=== PROCESSING WORKLOAD ===');
            workload.forEach(worker => {
                const fullName = (worker.full_name || '').trim().replace(/\s+/g, ' ').toLowerCase();
                const taskCount = worker.open_tasks_count || 0;
                const user = userMap.get(fullName);

                console.log(`Worker: "${fullName}" (${taskCount} tasks)`);

                if (user) {
                    const weight = user.weight || 0;
                    const level = getLevel(weight);
                    console.log(`  -> Found user with weight ${weight} (${level})`);

                    switch (level) {
                        case 'Junior':
                            juniorTasks += taskCount;
                            console.log(`  -> Added to Junior: ${taskCount} (total: ${juniorTasks})`);
                            break;
                        case 'Middle':
                            middleTasks += taskCount;
                            console.log(`  -> Added to Middle: ${taskCount} (total: ${middleTasks})`);
                            break;
                        case 'Senior':
                            seniorTasks += taskCount;
                            console.log(`  -> Added to Senior: ${taskCount} (total: ${seniorTasks})`);
                            break;
                    }
                } else {
                    console.log(`  -> User NOT FOUND! Adding to Junior by default`);
                    console.log(`  -> Available users:`, Array.from(userMap.keys()));
                    juniorTasks += taskCount;
                }
            });

            console.log('=== FINAL RESULTS ===');
            console.log('Junior tasks:', juniorTasks);
            console.log('Middle tasks:', middleTasks);
            console.log('Senior tasks:', seniorTasks);

            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.status === true || u.status === 1).length;
            const totalTasks = juniorTasks + middleTasks + seniorTasks;

            const avgTasksPerExecutor = activeUsers > 0 ? totalTasks / activeUsers : 0;
            const avgProcessingTimeMs = Math.round(avgTasksPerExecutor * 20);

            setStatsData([
                {
                    title: 'Всего задач',
                    value: totalTasks.toString(),
                    changeType: 'positive',
                    subtitle: 'в работе у исполнителей',
                    icon: 'tasks',
                    color: '#3b82f6'
                },
                {
                    title: 'Активных исполнителей',
                    value: activeUsers.toString(),
                    changeType: 'positive',
                    subtitle: 'работают сейчас',
                    icon: 'users',
                    color: '#10b981'
                },
                {
                    title: 'Средняя загрузка',
                    value: `${avgProcessingTimeMs} мс`,
                    changeType: 'positive',
                    subtitle: 'на исполнителя',
                    icon: 'check',
                    color: '#22c55e'
                }
            ]);

            const maxTasks = Math.max(juniorTasks, middleTasks, seniorTasks, 1);

            const formattedBarData = [
                {
                    label: 'Junior',
                    value: juniorTasks,
                    height: `${Math.round((juniorTasks / maxTasks) * 100)}%`
                },
                {
                    label: 'Middle',
                    value: middleTasks,
                    height: `${Math.round((middleTasks / maxTasks) * 100)}%`
                },
                {
                    label: 'Senior',
                    value: seniorTasks,
                    height: `${Math.round((seniorTasks / maxTasks) * 100)}%`
                }
            ];

            console.log('=== BAR CHART DATA ===');
            console.log('formattedBarData:', formattedBarData);

            setBarData(formattedBarData);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных дашборда:', error);
            showToast('Ошибка загрузки данных', 'error');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard">
                <h1 className="dashboard-heading">Dashboard</h1>
                <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Загрузка данных...
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

            <h1 className="dashboard-heading">Dashboard</h1>

            <div className="stats-grid">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="charts-grid">
                <BarChart
                    title="Распределение задач по уровням"
                    data={barData}
                />
                <LineChart title="Загрузка системы" />
            </div>

            <div className="bottom-grid">
                <TasksList title="Последние задачи" tasks={tasksData} />
            </div>
        </div>
    );
};

export default DashboardPage;
