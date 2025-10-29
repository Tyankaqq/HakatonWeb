// src/API/TasksAPI/TasksAPI.js
const BASE_URL = 'https://a1981d0765de.ngrok-free.app/api/v1';

// Получить все задачи
export async function fetchTasks() {
    try {
        const response = await fetch(`${BASE_URL}/tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Tasks API response:', data);
        return data;
    } catch (error) {
        console.error('fetchTasks error:', error);
        throw error;
    }
}
