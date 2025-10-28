// src/API/UsersAPI/UsersAPI.js
const BASE_URL = 'https://a4b0ae7793b5.ngrok-free.app/api/v1';

export async function fetchUsers(status = 1, withTasksCount = 1) {
    const params = new URLSearchParams({
        status: status,
        with_tasks_count: withTasksCount
    });

    const response = await fetch(`${BASE_URL}/users?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' // Для ngrok
        },
    });

    if (!response.ok) throw new Error('Ошибка получения пользователей');
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