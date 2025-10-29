    // src/hooks/useBalancer.js
    import { useState, useEffect, useCallback } from 'react';
    import { fetchActiveUsersWorkload } from '../API/ExecutorsAPI/ExecutorsAPI.js';

    export const useBalancer = () => {
        const [executors, setExecutors] = useState([]);
        const [stats, setStats] = useState({
            totalAssigned: 0,
            lastMinute: 0,
            avgTime: 0,
        });
        const [loading, setLoading] = useState(true);

        // Загрузка исполнителей из API один раз
        const loadExecutors = useCallback(async () => {
            try {
                setLoading(true);
                const response = await fetchActiveUsersWorkload();

                console.log('API Response:', response);

                if (response.success && Array.isArray(response.data)) {
                    const formattedExecutors = response.data.map((user, index) => {
                        const nameParts = user.full_name.split(' ');
                        const firstName = nameParts[0] || '';
                        const lastName = nameParts[1] || '';
                        const initials = `${firstName[0] || '?'}${lastName[0] || '?'}`;

                        return {
                            id: index + 1,
                            name: user.full_name || 'Без имени',
                            initials: initials,
                            tasksCount: user.open_tasks_count || 0, // Статичное значение с бэка
                            status: user.open_tasks_count > 0 ? 'active' : 'idle',
                        };
                    });

                    // Один раз устанавливаем данные и больше не меняем
                    setExecutors(formattedExecutors);

                    // Статистика на основе данных с бэка
                    const totalTasks = formattedExecutors.reduce((sum, ex) => sum + ex.tasksCount, 0);

                    setStats({
                        totalAssigned: totalTasks,
                        lastMinute: 0,
                        avgTime: 0,
                    });

                    console.log('Executors loaded:', formattedExecutors);
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

        // Загружаем один раз при монтировании
        useEffect(() => {
            loadExecutors();
        }, [loadExecutors]);

        // Возвращаем только статичные данные
        return { stats, executors, loading };
    };
