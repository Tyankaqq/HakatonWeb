// src/API/UsersAPI/UsersAPI.js
const BASE_URL = 'https://a1981d0765de.ngrok-free.app/api/v1';

export async function fetchActiveUsersWorkload() {
    const response = await fetch(`${BASE_URL}/reports/active-users-workload`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка получения данных о загрузке пользователей');
    return response.json();
}

export async function fetchAllUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка получения пользователей');
    return response.json();
}

export async function createUser(userData) {
    const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Ошибка создания пользователя');
    return response.json();
}


// 1. Создать Junior исполнителя (вес 1-3)
export async function createJuniorExecutor(data) {
    // Генерируем случайный вес от 1 до 3
    const weight = Math.floor(Math.random() * 3) + 1;

    const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name || '',
        status: data.status !== undefined ? data.status : true,
        daily_limit: data.daily_limit || 20, // Junior обычно меньше задач
        weight: weight,
        parameters: data.parameters || []
    };

    return createUser(userData);
}

// 2. Создать Middle исполнителя (вес 4-6)
export async function createMiddleExecutor(data) {
    // Генерируем случайный вес от 4 до 6
    const weight = Math.floor(Math.random() * 3) + 4;

    const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name || '',
        status: data.status !== undefined ? data.status : true,
        daily_limit: data.daily_limit || 40, // Middle больше задач
        weight: weight,
        parameters: data.parameters || []
    };

    return createUser(userData);
}

// 3. Создать Senior исполнителя (вес 7-10)
export async function createSeniorExecutor(data) {
    // Генерируем случайный вес от 7 до 10
    const weight = Math.floor(Math.random() * 4) + 7;

    const userData = {
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name || '',
        status: data.status !== undefined ? data.status : true,
        daily_limit: data.daily_limit || 60, // Senior максимум задач
        weight: weight,
        parameters: data.parameters || []
    };

    return createUser(userData);
}

export async function updateUser(userId, userData) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            first_name: userData.first_name,
            last_name: userData.last_name,
            middle_name: userData.middle_name,
            status: userData.status,
            daily_limit: userData.daily_limit,
            weight: userData.weight
        }),
    });

    if (!response.ok) throw new Error('Ошибка обновления пользователя');
    return response.json();
}

// Обновить параметры исполнителя
export async function updateUserParameters(userId, parameters) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            parameters: parameters
        }),
    });

    if (!response.ok) throw new Error('Ошибка обновления параметров');
    return response.json();
}

// Обновить всё сразу (данные + параметры)
export async function updateUserComplete(userId, userData, parameters) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
            first_name: userData.first_name,
            last_name: userData.last_name,
            middle_name: userData.middle_name,
            status: userData.status,
            daily_limit: userData.daily_limit,
            weight: userData.weight,
            parameters: parameters
        }),
    });

    if (!response.ok) throw new Error('Ошибка обновления пользователя');
    return response.json();
}
// Получить конкретного пользователя по ID
export async function fetchUserById(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка получения пользователя');
    return response.json();
}

// Удалить пользователя
export async function deleteUser(userId) {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка удаления пользователя');
    return response.json();
}