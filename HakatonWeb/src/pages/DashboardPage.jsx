import React from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import BarChart from '../components/Dashboard/BarChart';
import LineChart from '../components/Dashboard/LineChart';
import TasksList from '../components/Dashboard/TasksList';
import QueueStats from '../components/Dashboard/QueueStats';
import '../css/DashBoard/DashBoardPage.css';

const DashboardPage = () => {
    const statsData = [
        { title: 'Всего задач', value: '3,847', change: '+12.5%', changeType: 'positive', subtitle: 'за последнюю неделю', icon: 'tasks', color: '#3b82f6' },
        { title: 'Активных исполнителей', value: '247', change: '+3.2%', changeType: 'positive', subtitle: 'за последнюю неделю', icon: 'users', color: '#10b981' },
        { title: 'В обработке', value: '1,234', change: '-2.1%', changeType: 'negative', subtitle: 'за последнюю неделю', icon: 'clock', color: '#f59e0b' },
        { title: 'Завершено сегодня', value: '892', change: '+18.3%', changeType: 'positive', subtitle: 'за последнюю неделю', icon: 'check', color: '#22c55e' }
    ];

    const barData = [
        { label: 'Пн', value: 145, height: '47%' },
        { label: 'Вт', value: 210, height: '68%' },
        { label: 'Ср', value: 180, height: '58%' },
        { label: 'Чт', value: 235, height: '76%' },
        { label: 'Пт', value: 310, height: '100%' },
        { label: 'Сб', value: 125, height: '40%' },
        { label: 'Вс', value: 85, height: '27%' }
    ];

    const tasksData = [
        { id: 'TSK-4721', title: 'Обработка заказов из CRM', assignee: 'Иванов А.П.', priority: 'high', status: 'pending' },
        { id: 'TSK-4720', title: 'Синхронизация каталога товаров', assignee: 'Петрова М.С.', priority: 'medium', status: 'completed' },
        { id: 'TSK-4719', title: 'Экспорт отчётов Excel', assignee: 'Сидоров К.В.', priority: 'low', status: 'pending' },
        { id: 'TSK-4718', title: 'Интеграция с платежной системой', assignee: 'Козлова Н.И.', priority: 'high', status: 'waiting' },
        { id: 'TSK-4717', title: 'Обновление данных через REST API', assignee: 'Морозов Д.А.', priority: 'medium', status: 'completed' }
    ];



    return (
        <div className="dashboard">
            <h1 className="dashboard-heading">Dashboard</h1>

            <div className="stats-grid">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="charts-grid">
                <BarChart title="Выполнено задач за неделю" data={barData} />
                <LineChart title="Загрузка системы" />
            </div>

            <div className="bottom-grid">
                <TasksList title="Последние задачи" tasks={tasksData} />

            </div>
        </div>
    );
};

export default DashboardPage;
