export const getTasks = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    task_id: 'TSK-4721',
                    title: 'Обработка заказов из CRM',
                    description: 'Синхронизация новых заказов с CRM системой',
                    priority: 'high',
                    user_id: 'Иванов А.П.',
                    parameters: ['CRM Integration', 'REST API', 'Data Analysis'],
                    created_at: '2025-10-27T10:30:00',
                    updated_at: '2025-10-27T10:30:00'
                },
                {
                    task_id: 'TSK-4720',
                    title: 'Синхронизация каталога товаров',
                    description: 'Обновление каталога из е-commerce системы',
                    priority: 'medium',
                    user_id: 'Петрова М.С.',
                    parameters: ['E-commerce', 'SQL', 'Python'],
                    created_at: '2025-10-27T09:45:00',
                    updated_at: '2025-10-27T09:45:00'
                },
                {
                    task_id: 'TSK-4719',
                    title: 'Экспорт отчетов Excel',
                    description: 'Формирование ежедневных отчетов',
                    priority: 'low',
                    user_id: 'Сидоров К.В.',
                    parameters: ['Excel', 'Reporting', 'Data Analysis'],
                    created_at: '2025-10-27T10:15:00',
                    updated_at: '2025-10-27T10:15:00'
                },
                {
                    task_id: 'TSK-4718',
                    title: 'Интеграция с платежной системой',
                    description: 'Обработка платежных транзакций через REST API',
                    priority: 'high',
                    user_id: 'Козлова Н.И.',
                    parameters: ['REST API', 'JavaScript', 'E-commerce'],
                    created_at: '2025-10-27T06:45:00',
                    updated_at: '2025-10-27T06:45:00'
                },
                {
                    task_id: 'TSK-4717',
                    title: 'Обновление данных через REST API',
                    description: 'Массовое обновление клиентских данных',
                    priority: 'medium',
                    user_id: 'Морозов Д.А.',
                    parameters: ['REST API', 'Python', 'SQL'],
                    created_at: '2025-10-27T08:30:00',
                    updated_at: '2025-10-27T08:30:00'
                },
                {
                    task_id: 'TSK-4716',
                    title: 'Импорт данных из ERP',
                    description: 'Загрузка складских остатков',
                    priority: 'high',
                    user_id: 'Васильев И.Л.',
                    parameters: ['ERP Systems', 'SQL', 'Data Analysis'],
                    created_at: '2025-10-27T05:15:00',
                    updated_at: '2025-10-27T05:15:00'
                }
            ]);
        }, 500);
    });
};
