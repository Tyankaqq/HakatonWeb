export const getStats = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                totalPerformers: 247,
                activeNow: 189,
                avgLoad: 73,
                completedToday: 892
            });
        }, 300);
    });
};

export const getPerformers = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    initials: 'ИА',
                    name: 'Иванов Алексей Петрович',
                    email: 'ivanov@company.com',
                    status: 'Активен',
                    totalTasks: 234,
                    completed: 189,
                    inProgress: 45,
                    productivity: 85,
                    lastActivity: new Date(Date.now() - 2 * 60 * 1000) // 2 минуты назад
                },
                {
                    id: 2,
                    initials: 'ПМ',
                    name: 'Петрова Мария Сергеевна',
                    email: 'petrova@company.com',
                    status: 'Активен',
                    totalTasks: 198,
                    completed: 176,
                    inProgress: 22,
                    productivity: 92,
                    lastActivity: new Date(Date.now() - 5 * 60 * 1000) // 5 минут назад
                },
                {
                    id: 3,
                    initials: 'СК',
                    name: 'Сидоров Константин Владимирович',
                    email: 'sidorov@company.com',
                    status: 'Активен',
                    totalTasks: 167,
                    completed: 134,
                    inProgress: 33,
                    productivity: 78,
                    lastActivity: new Date(Date.now() - 15 * 60 * 1000) // 15 минут назад
                },
                {
                    id: 4,
                    initials: 'КН',
                    name: 'Козлова Надежда Ивановна',
                    email: 'kozlova@company.com',
                    status: 'Не в сети',
                    totalTasks: 145,
                    completed: 128,
                    inProgress: 17,
                    productivity: 88,
                    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 часа назад
                },
                {
                    id: 5,
                    initials: 'МД',
                    name: 'Морозов Дмитрий Александрович',
                    email: 'morozov@company.com',
                    status: 'Активен',
                    totalTasks: 212,
                    completed: 198,
                    inProgress: 14,
                    productivity: 95,
                    lastActivity: new Date(Date.now() - 1 * 60 * 1000) // 1 минута назад
                }
            ]);
        }, 500);
    });
};