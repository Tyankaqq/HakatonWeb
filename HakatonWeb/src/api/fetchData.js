export async function fetchData() {
    const res = await fetch(``);
    if (!res.ok) throw new Error("Ошибка при загрузке данных");
    const json = await res.json();
    console.log(json);
    return json.admins;
}