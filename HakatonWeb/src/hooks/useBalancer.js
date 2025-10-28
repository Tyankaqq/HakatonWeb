// src/hooks/useBalancer.js
import { useState, useEffect } from 'react';
import { fetchAllUsers } from '../API/UsersAPI/UsersAPI.js';

export const useBalancer = () => {
    const [executors, setExecutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssigned: 0,
        lastMinute: 0,
        avgTime: 0,
    });

    // Загрузка исполнителей из API
    useEffect(() => {
        const loadExecutors = async () => {
            try {
                setLoading(true);
                const response = await fetchAllUsers();

                console.log('API Response:', response); // Отладка

                // Обработка ответа в зависимости от структуры
                let users = [];
                if (response.success && Array.isArray(response.data)) {
                    users = response.data;
                } else if (Array.isArray(response)) {
                    users = response;
                }

                // Форматируем данные для отображения
                const formattedExecutors = users.map(user => ({
                    id: user.id?.toString() || Math.random().toString(),
                    name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                    initials: `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`,
                    tasksCount: user.tasks_count || user.daily_limit || 0,
                    status: user.status ? 'active' : 'inactive',
                    weight: user.weight || 1,
                    daily_limit: user.daily_limit || 0
                }));

                setExecutors(formattedExecutors);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки исполнителей:', error);
                setExecutors([]);
                setLoading(false);
            }
        };

        loadExecutors();
    }, []);

    return { stats, executors, loading };
};
