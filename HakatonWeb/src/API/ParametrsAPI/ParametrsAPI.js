const BASE_URL = 'https://a1981d0765de.ngrok-free.app/api/v1';


export async function fetchParameters() {
    const response = await fetch(`${BASE_URL}/parameters`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Ошибка получения параметров');
    return response.json();
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
