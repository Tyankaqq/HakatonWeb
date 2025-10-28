export const getDashboardData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                stats: {
                    totalTasks: 3847,
                    activeExecutors: 247,
                    inProgress: 1234,
                    completedToday: 892
                },
                weeklyTasks: [
                    { label: 'Пн', value: 145 },
                    { label: 'Вт', value: 210 },
                    { label: 'Ср', value: 180 },
                    { label: 'Чт', value: 235 },
                    { label: 'Пт', value: 310 },
                    { label: 'Сб', value: 125 },
                    { label: 'Вс', value: 85 }
                ],
                systemLoad: [
                    { label: '00:00', value: 20 },
                    { label: '04:00', value: 15 },
                    { label: '08:00', value: 75 },
                    { label: '12:00', value: 95 },
                    { label: '16:00', value: 85 },
                    { label: '20:00', value: 45 }
                ],
                recentTasks: [
                    { id: 'TSK-4721', title: 'Обработка заказов из CRM', assignee: 'Иванов А.П.', priority: 'high', status: 'high' },
                    { id: 'TSK-4720', title: 'Синхронизация каталога товаров', assignee: 'Петрова М.С.', priority: 'medium', status: 'medium' },
                    { id: 'TSK-4719', title: 'Экспорт отчетов Excel', assignee: 'Сидоров К.В.', priority: 'low', status: 'low' },
                    { id: 'TSK-4718', title: 'Интеграция с платежной системой', assignee: 'Козлова Н.И.', priority: 'high', status: 'high' },
                    { id: 'TSK-4717', title: 'Обновление данных через REST API', assignee: 'Морозов Д.А.', priority: 'medium', status: 'medium' }
                ],
                queueStats: [
                    { name: 'High Priority', count: 234, progress: 78, color: '#ef4444' },
                    { name: 'Medium Priority', count: 567, progress: 56, color: '#3b82f6' },
                    { name: 'Low Priority', count: 892, progress: 34, color: '#94a3b8' },
                    { name: 'Integration Tasks', count: 145, progress: 67, color: '#8b5cf6' }
                ]
            });
        }, 500);
    });
};
