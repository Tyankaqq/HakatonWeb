export const getTasks = async () => {
    // Имитация API запроса
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 'TSK-4721',
                    title: 'Обработка заказов из CRM',
                    description: 'Синхронизация новых заказов с CRM системой',
                    assignee: 'Иванов А.П.',
                    status: 'Высокий',
                    priority: 'High Priority',
                    queue: '2025-10-27 10:30',
                    updatedAt: '2025-10-27T10:30:00'
                },
                {
                    id: 'TSK-4720',
                    title: 'Синхронизация каталога товаров',
                    description: 'Обновление каталога из е-commerce системы',
                    assignee: 'Петрова М.С.',
                    status: 'Средний',
                    priority: 'Medium Priority',
                    queue: '2025-10-27 09:45',
                    updatedAt: '2025-10-27T09:45:00'
                },
                {
                    id: 'TSK-4719',
                    title: 'Экспорт отчетов Excel',
                    description: 'Формирование ежедневных отчетов',
                    assignee: 'Сидоров К.В.',
                    status: 'Низкий',
                    priority: 'Low Priority',
                    queue: '2025-10-27 10:15',
                    updatedAt: '2025-10-27T10:15:00'
                },
                {
                    id: 'TSK-4718',
                    title: 'Интеграция с платежной системой',
                    description: 'Обработка платежных транзакций через REST API',
                    assignee: 'Козлова Н.И.',
                    status: 'Высокий',
                    priority: 'Integration Tasks',
                    queue: '2025-10-27 06:45',
                    updatedAt: '2025-10-27T06:45:00'
                },
                {
                    id: 'TSK-4717',
                    title: 'Обновление данных через REST API',
                    description: 'Массовое обновление клиентских данных',
                    assignee: 'Морозов Д.А.',
                    status: 'Средний',
                    priority: 'Medium Priority',
                    queue: '2025-10-27 08:30',
                    updatedAt: '2025-10-27T08:30:00'
                },
                {
                    id: 'TSK-4716',
                    title: 'Импорт данных из ERP',
                    description: 'Загрузка складских остатков',
                    assignee: 'Васильев И.Л.',
                    status: 'Высокий',
                    priority: 'High Priority',
                    queue: '2025-10-27 05:15',
                    updatedAt: '2025-10-27T05:15:00'
                }
            ]);
        }, 500);
    });
};