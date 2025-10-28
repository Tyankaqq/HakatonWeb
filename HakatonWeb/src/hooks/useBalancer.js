// src/hooks/useBalancer.js
import { useState, useEffect, useCallback } from 'react';
import { fetchActiveUsersWorkload } from '../API/ExecutorsAPI/ExecutorsAPI.js';

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

export const useBalancer = () => {
    const [assignments, setAssignments] = useState([]);
    const [executors, setExecutors] = useState([]);
    const [stats, setStats] = useState({
        totalAssigned: 0,
        lastMinute: 0,
        avgTime: 0,
    });
    const [loading, setLoading] = useState(true);

    // Загрузка исполнителей из API
    const loadExecutors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchActiveUsersWorkload();

            console.log('API Response:', response);

            // Структура ответа: { success: true, data: [{ full_name, open_tasks_count }] }
            if (response.success && Array.isArray(response.data)) {
                const formattedExecutors = response.data.map((user, index) => {
                    // Парсим ФИО
                    const nameParts = user.full_name.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts[1] || '';
                    const initials = `${firstName[0] || '?'}${lastName[0] || '?'}`;

                    return {
                        id: index + 1, // Генерируем ID, так как в API его нет
                        name: user.full_name || 'Без имени',
                        initials: initials,
                        tasksCount: user.open_tasks_count || 0,
                        status: user.open_tasks_count > 0 ? 'active' : 'idle', // Считаем активным если есть задачи
                    };
                });

                setExecutors(formattedExecutors);
                console.log('Formatted executors:', formattedExecutors);
            } else {
                console.error('Неожиданная структура ответа:', response);
                setExecutors([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки исполнителей:', error);
            setExecutors([]);
            setLoading(false);
        }
    }, []);

    // Загружаем исполнителей при монтировании
    useEffect(() => {
        loadExecutors();
    }, [loadExecutors]);

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
        // Фильтруем только активных исполнителей
        const activeExecutors = executors.filter(ex => ex.status === 'active');

        if (activeExecutors.length === 0) return null;

        // Выбираем исполнителя с минимальным количеством задач
        return activeExecutors.reduce((prev, current) =>
            prev.tasksCount < current.tasksCount ? prev : current
        );
    }, []);

    // Автоматическое распределение задач
    useEffect(() => {
        if (executors.length === 0) return;

        const interval = setInterval(() => {
            const task = generateTask();
            const executor = selectExecutor(executors);

            if (!executor) return; // Нет доступных исполнителей

            const newAssignment = {
                id: `${Date.now()}-${Math.random()}`,
                task,
                executor,
                timestamp: Date.now(),
            };

            setAssignments((prev) => [newAssignment, ...prev.slice(0, 9)]);

            // Обновляем счетчик задач у исполнителя
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
        }, 3000); // Каждые 3 секунды

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
