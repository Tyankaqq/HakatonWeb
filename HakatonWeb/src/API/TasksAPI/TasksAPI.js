// src/API/TasksAPI/TasksAPI.js
const BASE_URL = 'https://a4b0ae7793b5.ngrok-free.app/api/v1';

// Получить все задачи
export async function fetchTasks() {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка получения задач');
    return response.json();
}

// Получить задачу по ID
export async function fetchTaskById(taskId) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка получения задачи');
    return response.json();
}

// Создать задачу
export async function createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Ошибка создания задачи');
    return response.json();
}

// Обновить задачу
export async function updateTask(taskId, taskData) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Ошибка обновления задачи');
    return response.json();
}

// Удалить задачу
export async function deleteTask(taskId) {
    const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
    });

    if (!response.ok) throw new Error('Ошибка удаления задачи');
    return response.json();
}
