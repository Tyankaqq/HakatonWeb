import React, { useEffect, useState } from 'react';
import {
    fetchParameters,
    createParameter,
    updateParameter,
    deleteParameter
} from '../API/ParametrsAPI/ParametrsAPI.js';
import '../css/ParametrsPage/ParametrsPage.css';

function ParametrsPage() {
    const [parameters, setParameters] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Все статусы');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredParameters, setFilteredParameters] = useState([]);


    // Данные для создания/редактирования параметра
    const [currentParam, setCurrentParam] = useState({
        id: '',
        value: '',
        name: '',
        description: '',
        status: 'Активен'
    });

    // Флаг редактирования
    const [isEditing, setIsEditing] = useState(false);

    // Загрузка параметров с сервера
    useEffect(() => {
        loadParameters();
    }, []);

    useEffect(() => {
        if (!parameters) return;
        setFilteredParameters(parameters.filter(param =>
            (param.name.toLowerCase().includes(search.toLowerCase()) ||
                param.id.toLowerCase().includes(search.toLowerCase())) &&
            (statusFilter === 'Все статусы' || param.status === statusFilter)
        ));
    }, [parameters, search, statusFilter]);


    const loadParameters = async () => {
        setLoading(true);
        try {
            const data = await fetchParameters();
            setParameters(Array.isArray(data) ? data : []);  // Защита от undefined/null
        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки параметров');
        } finally {
            setLoading(false);
        }
    };


    // Открыть модалку для нового параметра
    const openNewParamModal = () => {
        setCurrentParam({ id: '', value: '', name: '', description: '', status: 'Активен' });
        setIsEditing(false);
        setModalOpen(true);
    };

    // Открыть модалку для редактирования существующего параметра
    const openEditParamModal = (param) => {
        setCurrentParam(param);
        setIsEditing(true);
        setModalOpen(true);
    };

    // Сохранить (создать или обновить)
    const handleSaveParam = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateParameter(currentParam.id, currentParam);
                setParameters(prev => prev.map(p => (p.id === currentParam.id ? currentParam : p)));
            } else {
                const newParam = await createParameter(currentParam);
                setParameters(prev => [...prev, newParam]);
            }
            setModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Ошибка сохранения параметра');
        }
    };

    // Удалить параметр
    const handleDeleteParam = async (id) => {
        if (!window.confirm('Удалить параметр?')) return;
        try {
            await deleteParameter(id);
            setParameters(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            alert('Ошибка удаления параметра');
        }
    };

    return (
        <>
            {parameters ?
                (
                    <div className="parameters-page">
                        <div className="stats-row">
                            <div className="stats-card">
                                <div className="stats-label">Всего параметров</div>
                                <div className="stats-value">{parameters.length}</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-label">Активных</div>
                                <div className="stats-value">{parameters.filter(p => p.status === 'Активен').length}</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-label">Неактивных</div>
                                <div className="stats-value">{parameters.filter(p => p.status !== 'Активен').length}</div>
                            </div>
                            <div className="stats-card">
                                <div className="stats-label">% Активных</div>
                                <div className="stats-value">
                                    {parameters.length ? Math.round(100 * parameters.filter(p => p.status === 'Активен').length / parameters.length) : 0}%
                                </div>
                            </div>
                        </div>

                        <div className="top-actions-row">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Поиск по названию, идентификатору..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option>Все статусы</option>
                                <option>Активен</option>
                                <option>Неактивен</option>
                            </select>
                            <button className="create-button" onClick={openNewParamModal}>
                                + Создать параметр
                            </button>
                        </div>

                        <table>
                            <thead>
                            <tr>
                                <th>Идентификатор</th>
                                <th>Значение</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6">Загрузка...</td>
                                </tr>
                            ) : filteredParameters.length === 0 ? (
                                <tr>
                                    <td colSpan="6">Параметры не найдены</td>
                                </tr>
                            ) : (
                                filteredParameters.map(param => (
                                    <tr key={param.id}>
                                        <td><span className="mini-tag">{param.id}</span></td>
                                        <td>{param.value}</td>
                                        <td><span className="mini-tag">{param.name}</span></td>
                                        <td>{param.description}</td>
                                        <td>
                                    <span className={param.status === 'Активен' ? 'status-active' : 'status-inactive'}>
                                        {param.status}
                                    </span>
                                        </td>
                                        <td>
                                            <button className="edit-btn" onClick={() => openEditParamModal(param)}>✏️
                                            </button>
                                            <button className="delete-btn" onClick={() => handleDeleteParam(param.id)}>🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                        {/* Модальное окно */}
                        {modalOpen && (
                            <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                                <div className="modal-window" onClick={e => e.stopPropagation()}>
                                    <h3>{isEditing ? 'Редактировать параметр' : 'Создать новый параметр'}</h3>
                                    <form className="modal-form" onSubmit={handleSaveParam}>
                                        <input
                                            required
                                            placeholder="Идентификатор"
                                            value={currentParam.id}
                                            disabled={isEditing}
                                            onChange={e => setCurrentParam({...currentParam, id: e.target.value})}
                                        />
                                        <input
                                            required
                                            placeholder="Значение"
                                            value={currentParam.value}
                                            onChange={e => setCurrentParam({...currentParam, value: e.target.value})}
                                        />
                                        <input
                                            required
                                            placeholder="Название"
                                            value={currentParam.name}
                                            onChange={e => setCurrentParam({...currentParam, name: e.target.value})}
                                        />
                                        <input
                                            required
                                            placeholder="Описание"
                                            value={currentParam.description}
                                            onChange={e => setCurrentParam({...currentParam, description: e.target.value})}
                                        />
                                        <select
                                            value={currentParam.status}
                                            onChange={e => setCurrentParam({...currentParam, status: e.target.value})}
                                        >
                                            <option>Активен</option>
                                            <option>Неактивен</option>
                                        </select>
                                        <div className="modal-actions">
                                            <button type="submit" className="create-button">
                                                {isEditing ? 'Обновить' : 'Добавить'}
                                            </button>
                                            <button type="button" className="cancel-btn"
                                                    onClick={() => setModalOpen(false)}>
                                                Отмена
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (<div>Загрузка...</div>)
            }
        </>
    );
}

export default ParametrsPage;
