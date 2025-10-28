const BASE_URL = 'https://ea7cca192853.ngrok-free.app/api/v1';

export async function fetchParameters() {
    const response = await fetch(`${BASE_URL}/parameters`);
    if (!response.ok) throw new Error('Ошибка загрузки параметров');
    return response.data;
}

export async function createParameter(param) {
    const response = await fetch(`${BASE_URL}/parameters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param),
    });
    if (!response.ok) throw new Error('Ошибка создания параметра');
    return response.json();
}

export async function updateParameter(id, param) {
    const response = await fetch(`${BASE_URL}/parameters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param),
    });
    if (!response.ok) throw new Error('Ошибка обновления параметра');
    return response.json();
}

export async function deleteParameter(id) {
    const response = await fetch(`${BASE_URL}/parameters/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Ошибка удаления параметра');
    return response.json();
}
