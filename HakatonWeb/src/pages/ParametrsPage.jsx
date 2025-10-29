import React, { useEffect, useState } from 'react';
import {
    fetchParameters,
    createParameter,
    updateParameter,
    deleteParameter
} from '../API/ParametrsAPI/ParametrsAPI.js';
import '../css/ParametrsPage/ParametrsPage.css';
import EditLogo from '../assets/Image/EditLogo.svg';
import DeleteIcon from '../assets/Image/DeleteIcon.svg';
import Toast from '../components/Toast.jsx';

function ParametrsPage() {
    const [parameters, setParameters] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Все статусы');
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredParameters, setFilteredParameters] = useState([]);

    // Состояние для тоста
    const [toast, setToast] = useState(null);

    // Данные для создания/редактирования параметра
    const [currentParam, setCurrentParam] = useState({
        key: '',
        value_type: '',
        is_active: true
    });

    const [isEditing, setIsEditing] = useState(false);

    // Функции управления тостом
    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type, duration });
    };
    const hideToast = () => {
        setToast(null);
    };

    const loadParameters = async () => {
        try {
            setLoading(true);
            const response = await fetchParameters();

            if (response.success && Array.isArray(response.data)) {
                setParameters(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setParameters([]);
            setLoading(false);
            showToast('Ошибка загрузки параметров', 'error');
        }
    };

    useEffect(() => {
        loadParameters();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                await updateParameter(currentParam.id, currentParam);
                showToast('Параметр успешно обновлен', 'success');
            } else {
                await createParameter(currentParam);
                showToast('Параметр успешно добавлен', 'success');
            }

            await loadParameters();

            setModalOpen(false);
            setCurrentParam({ key: '', value_type: '', is_active: true });
        } catch (error) {
            console.error('Ошибка:', error);
            showToast('Ошибка при сохранении параметра', 'error');
        }
    };

    useEffect(() => {
        if (!parameters || !Array.isArray(parameters)) return;

        setFilteredParameters(parameters.filter(param => {
            const matchesSearch = param.key.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === 'Все статусы' ||
                (statusFilter === 'Активен' && param.is_active) ||
                (statusFilter === 'Неактивен' && !param.is_active);

            return matchesSearch && matchesStatus;
        }));
    }, [parameters, search, statusFilter]);

    const openNewParamModal = () => {
        setCurrentParam({ key: '', value_type: 'string', is_active: true });
        setIsEditing(false);
        setModalOpen(true);
    };

    const openEditParamModal = (param) => {
        setCurrentParam(param);
        setIsEditing(true);
        setModalOpen(true);
    };

    const handleDeleteParam = async (id) => {
        if (!window.confirm('Удалить параметр?')) return;
        try {
            await deleteParameter(id);
            await loadParameters();
            showToast('Параметр успешно удален', 'success');
        } catch (error) {
            console.error(error);
            showToast('Ошибка удаления параметра', 'error');
        }
    };

    const activeCount = parameters.filter(p => p.is_active).length;
    const inactiveCount = parameters.length - activeCount;

    return (
        <div className="parameters-page">
            {/* Toast уведомление */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={hideToast}
                />
            )}

            <div className="stats-row">
                <div className="stats-card">
                    <div className="stats-label">Всего параметров</div>
                    <div className="stats-value">{parameters.length}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">Активных</div>
                    <div className="stats-value">{activeCount}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">Неактивных</div>
                    <div className="stats-value">{inactiveCount}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">% Активных</div>
                    <div className="stats-value">
                        {parameters.length ? Math.round(100 * activeCount / parameters.length) : 0}%
                    </div>
                </div>
            </div>

            <div className="top-actions-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Поиск по идентификатору..."
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
                    <th>ID</th>
                    <th>Идентификатор</th>
                    <th>Тип значения</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="5">Загрузка...</td>
                    </tr>
                ) : filteredParameters.length === 0 ? (
                    <tr>
                        <td colSpan="5">Параметры не найдены</td>
                    </tr>
                ) : (
                    filteredParameters.map(param => (
                        <tr key={param.id}>
                            <td>{param.id}</td>
                            <td><span className="mini-tag">{param.key}</span></td>
                            <td>{param.value_type}</td>
                            <td>
                                <span className={param.is_active ? 'status-active' : 'status-inactive'}>
                                    {param.is_active ? 'Активен' : 'Неактивен'}
                                </span>
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => openEditParamModal(param)}>
                                    <img src={EditLogo} width="30px" height="30px" />
                                </button>

                                <button className="delete-btn" onClick={() => handleDeleteParam(param.id)}>
                                    <img src={DeleteIcon} width="30px" height="30px" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-window" onClick={e => e.stopPropagation()}>
                        <h3>{isEditing ? 'Редактировать параметр' : 'Создать новый параметр'}</h3>
                        <form className="modal-form" onSubmit={handleSubmit}>
                            <input
                                required
                                placeholder="Идентификатор"
                                value={currentParam.key}
                                disabled={isEditing}
                                onChange={e => setCurrentParam({...currentParam, key: e.target.value})}
                            />
                            <select
                                value={currentParam.value_type}
                                onChange={e => setCurrentParam({...currentParam, value_type: e.target.value})}
                            >
                                <option value="string">string</option>
                                <option value="integer">integer</option>
                                <option value="float">float</option>
                                <option value="boolean">boolean</option>
                                <option value="array">array</option>
                                <option value="date">date</option>
                            </select>

                            <select
                                value={currentParam.is_active ? 'Активен' : 'Неактивен'}
                                onChange={e => setCurrentParam({...currentParam, is_active: e.target.value === 'Активен'})}
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
    );
}

export default ParametrsPage;
