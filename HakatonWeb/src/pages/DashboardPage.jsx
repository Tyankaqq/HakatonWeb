// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import BarChart from '../components/Dashboard/BarChart';
import LineChart from '../components/Dashboard/LineChart';
import TasksList from '../components/Dashboard/TasksList';
import Toast from '../components/Toast';
import { fetchAllUsers, fetchActiveUsersWorkload } from '../API/ExecutorsAPI/ExecutorsAPI.js';
import { fetchTasks } from '../API/TasksAPI/TasksAPI.js';
import '../css/DashBoard/DashBoardPage.css';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]); // ✅ Данные для линейного графика
    const [tasksData, setTasksData] = useState([]);
    const [toast, setToast] = useState(null);

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

            // Параллельная загрузка всех данных
            const [usersResponse, workloadResponse, tasksResponse] = await Promise.allSettled([
                fetchAllUsers(),
                fetchActiveUsersWorkload(),
                fetchTasks()
            ]);

            console.log('=== API RESPONSES ===');
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

            // Создаем карту пользователей по ID для быстрого поиска
            const usersById = new Map();
            users.forEach(user => {
                usersById.set(user.id, user);
            });

            console.log('Users map created:', usersById.size, 'users');

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

                // Пробуем разные варианты структуры ответа
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

            }

            // Форматируем задачи с поиском исполнителя по user_id
            const formattedTasks = tasks.slice(0, 5).map(task => {
                let assigneeName = 'Не назначен';

                // Пробуем найти пользователя по разным полям
                const userId = task.user_id || task.assigned_to || task.assignee_id;

                if (userId) {
                    const user = usersById.get(userId);
                    if (user) {
                        // Формируем ФИО
                        const parts = [
                            user.first_name || '',
                            user.last_name || '',
                            user.middle_name || ''
                        ].filter(part => part.trim() !== '');

                        assigneeName = parts.join(' ').trim() || 'Пользователь';
                        console.log(`Task ${task.task_id}: user_id=${userId} -> ${assigneeName}`);
                    } else {
                        console.log(`Task ${task.task_id}: user_id=${userId} not found in users map`);
                        assigneeName = `ID: ${userId}`;
                    }
                }

                const executionTime = task.execution_time_ms !== null && task.execution_time_ms !== undefined
                    ? task.execution_time_ms
                    : 0;

                return {
                    id: task.task_id || task.id || 'N/A',
                    title: task.title || 'Без названия',
                    assignee: assigneeName,
                    priority: task.priority || 'medium',
                    status: 'completed',
                    executionTime: `${executionTime}` // ✅ Время выполнения задачи
                };
            });

            console.log('Formatted tasks:', formattedTasks);
            setTasksData(formattedTasks);

            // Формируем данные для линейного графика (время выполнения последних задач)
            const lineData = formattedTasks.map((task, index) => ({
                label: `${index + 1}`, // Номер задачи
                value: parseInt(task.executionTime) || 0 // Время выполнения в мс
            }));

            console.log('Line chart data:', lineData);
            setLineChartData(lineData);

            // Создаем карту пользователей по полному имени
            const userMap = new Map();
            users.forEach(user => {
                const parts = [
                    user.first_name || '',
                    user.last_name || '',
                    user.middle_name || ''
                ].filter(part => part.trim() !== '');

                const fullName = parts.join(' ').trim().replace(/\s+/g, ' ').toLowerCase();
                userMap.set(fullName, user);
            });

            // Группируем задачи по уровням
            let juniorTasks = 0;
            let middleTasks = 0;
            let seniorTasks = 0;

            workload.forEach(worker => {
                const fullName = (worker.full_name || '').trim().replace(/\s+/g, ' ').toLowerCase();
                const taskCount = worker.open_tasks_count || 0;
                const user = userMap.get(fullName);

                if (user) {
                    const level = getLevel(user.weight || 0);
                    switch (level) {
                        case 'Junior':
                            juniorTasks += taskCount;
                            break;
                        case 'Middle':
                            middleTasks += taskCount;
                            break;
                        case 'Senior':
                            seniorTasks += taskCount;
                            break;
                    }
                } else {
                    juniorTasks += taskCount;
                }
            });

            // Статистика
            const totalUsers = users.length;
            const activeUsers = users.filter(u => u.status === true || u.status === 1).length;
            const totalTasks = juniorTasks + middleTasks + seniorTasks;

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
                    title: 'Средняя загрузка задачи',
                    value: `${formattedTasks[0]?.executionTime ?? "0"} мс`,
                    changeType: 'positive',
                    subtitle: 'время выполнения',
                    icon: 'check',
                    color: '#22c55e'
                }
            ]);

            // График
            const maxTasks = Math.max(juniorTasks, middleTasks, seniorTasks, 1);
            const formattedBarData = [
                {
                    label: 'Junior',
                    value: juniorTasks,
                    height: `${Math.round((juniorTasks / maxTasks) * 80)}%`
                },
                {
                    label: 'Middle',
                    value: middleTasks,
                    height: `${Math.round((middleTasks / maxTasks) * 80)}%`
                },
                {
                    label: 'Senior',
                    value: seniorTasks,
                    height: `${Math.round((seniorTasks / maxTasks) * 80)}%`
                }
            ];

            setBarData(formattedBarData);
            setLoading(false);

        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
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
                <LineChart
                    title="Загрузка системы"
                    data={lineChartData} // ✅ Передаем данные о времени выполнения
                />
            </div>

            <div className="bottom-grid">
                <TasksList title="Последние задачи" tasks={tasksData} />
            </div>
        </div>
    );
};

export default DashboardPage;
