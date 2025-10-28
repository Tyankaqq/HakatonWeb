import { useState, useEffect, useCallback } from 'react';

const taskTemplates = [
    {
        title: 'Обработка заказа',
        priority: 'high',
        parameters: ['CRM Integration', 'REST API']
    },
    {
        title: 'Синхронизация данных CRM',
        priority: 'medium',
        parameters: ['CRM Integration', 'Python', 'SQL']
    },
    {
        title: 'Экспорт отчёта Excel',
        priority: 'low',
        parameters: ['Excel', 'Reporting']
    },
    {
        title: 'Интеграция с e-commerce',
        priority: 'high',
        parameters: ['E-commerce', 'REST API', 'JavaScript']
    },
    {
        title: 'Обновление каталога',
        priority: 'medium',
        parameters: ['E-commerce', 'SQL', 'Data Analysis']
    },
    {
        title: 'Загрузка остатков из ERP',
        priority: 'high',
        parameters: ['ERP Systems', 'SQL', 'Python']
    },
];

const initialExecutors = [
    { id: '1', name: 'Иванов А.П.', initials: 'ИА', tasksCount: 12, status: 'active' },
    { id: '2', name: 'Петрова М.С.', initials: 'ПМ', tasksCount: 8, status: 'active' },
    { id: '3', name: 'Сидоров К.В.', initials: 'СК', tasksCount: 15, status: 'busy' },
    { id: '4', name: 'Козлова Н.И.', initials: 'КН', tasksCount: 5, status: 'idle' },
    { id: '5', name: 'Морозов Д.А.', initials: 'МД', tasksCount: 10, status: 'active' },
    { id: '6', name: 'Васильев И.Л.', initials: 'ВИ', tasksCount: 7, status: 'active' },
];

export const useBalancer = () => {
    const [assignments, setAssignments] = useState([]);
    const [executors, setExecutors] = useState(initialExecutors);
    const [stats, setStats] = useState({
        totalAssigned: 3,
        lastMinute: 3,
        avgTime: 1.5,
    });
    const [loading, setLoading] = useState(false);

    const generateTask = useCallback(() => {
        const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        return {
            task_id: `TSK-${Math.floor(Math.random() * 10000)}`,
            title: template.title,
            priority: template.priority,
            parameters: template.parameters,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            timestamp: new Date().toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    }, []);

    const selectExecutor = useCallback((executors) => {
        return executors.reduce((prev, current) =>
            prev.tasksCount < current.tasksCount ? prev : current
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const task = generateTask();
            const executor = selectExecutor(executors);

            const newAssignment = {
                id: `${Date.now()}-${Math.random()}`,
                task,
                executor,
                timestamp: Date.now(),
            };

            setAssignments((prev) => [newAssignment, ...prev.slice(0, 9)]);

            setExecutors((prev) =>
                prev.map((ex) =>
                    ex.id === executor.id
                        ? { ...ex, tasksCount: ex.tasksCount + 1 }
                        : ex
                )
            );

            setStats((prev) => ({
                totalAssigned: prev.totalAssigned + 1,
                lastMinute: prev.lastMinute + 1,
                avgTime: Math.random() * 3 + 1,
            }));
        }, 2000);

        const minuteInterval = setInterval(() => {
            setStats((prev) => ({ ...prev, lastMinute: 0 }));
        }, 60000);

        return () => {
            clearInterval(interval);
            clearInterval(minuteInterval);
        };
    }, [executors, generateTask, selectExecutor]);

    return { stats, assignments, executors, loading };
};
