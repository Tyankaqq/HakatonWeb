import React, { useEffect, useState } from 'react';
import '../css/ParametrsPage/ParametrsPage.css';

function ParametrsPage() {
    const initialParams = [
        { id: 'python', value: 'Python', name: 'Python', description: 'Навык программирования на Python', status: 'Активен' },
        { id: 'javascript', value: 'JavaScript', name: 'JavaScript', description: 'Навык программирования на JavaScript', status: 'Активен' },
        { id: 'sql', value: 'SQL', name: 'SQL', description: 'Работа с SQL базами данных', status: 'Активен' },
        { id: 'rest_api', value: 'REST API', name: 'REST API', description: 'Работа с REST API', status: 'Активен' },
        { id: 'excel', value: 'Excel Advanced', name: 'Excel', description: 'Продвинутая работа с Excel', status: 'Активен' },
        { id: 'crm_integration', value: 'CRM Integration', name: 'CRM Integration', description: 'Специализация на интеграциях с CRM', status: 'Активен' },
        { id: 'ecommerce', value: 'E-commerce', name: 'E-commerce', description: 'Работа с e-commerce платформами', status: 'Активен' },
        { id: 'data_analysis', value: 'Data Analysis', name: 'Data Analysis', description: 'Анализ и обработка данных', status: 'Активен' },
        { id: 'erp_systems', value: 'ERP Systems', name: 'ERP Systems', description: 'Работа с ERP системами', status: 'Неактивен' },
        { id: 'reporting', value: 'Reporting', name: 'Reporting', description: 'Создание отчётов и дашбордов', status: 'Активен' },
        { id: 'docker', value: 'Docker', name: 'Docker', description: 'Контейнеризация приложений', status: 'Активен' },
        { id: 'kubernetes', value: 'Kubernetes', name: 'Kubernetes', description: 'Оркестрация контейнеров', status: 'Неактивен' }
    ];

    const [parameters, setParameters] = useState(initialParams);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('Все статусы');
    const [modalOpen, setModalOpen] = useState(false);
    const [newParam, setNewParam] = useState({
        id: '',
        value: '',
        name: '',
        description: '',
        status: 'Активен'
    });

    // Фильтрация по поиску и статусу
    const filteredParameters = parameters.filter(
        param =>
            (param.name.toLowerCase().includes(search.toLowerCase()) ||
                param.id.toLowerCase().includes(search.toLowerCase())) &&
            (statusFilter === 'Все статусы' || param.status === statusFilter)
    );

    // Карточки статистики
    const stats = {
        total: parameters.length,
        active: parameters.filter(p => p.status === 'Активен').length,
        inactive: parameters.filter(p => p.status !== 'Активен').length,
        percentActive: Math.round(100 * parameters.filter(p => p.status === 'Активен').length / parameters.length)
    };

    // Активные/неактивные теги снизу
    const activeParams = parameters.filter(p => p.status === 'Активен');
    const inactiveParams = parameters.filter(p => p.status !== 'Активен');

    // Добавить новый параметр
    const handleAddParameter = (e) => {
        e.preventDefault();
        setParameters(prev => [...prev, newParam]);
        setModalOpen(false);
        setNewParam({ id: '', value: '', name: '', description: '', status: 'Активен' });
    };

    return (
        <div className="parameters-page">
            <div className="stats-row">
                <div className="stats-card">
                    <div className="stats-label">Всего параметров</div>
                    <div className="stats-value">{stats.total}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">Активных</div>
                    <div className="stats-value">{stats.active}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">Неактивных</div>
                    <div className="stats-value">{stats.inactive}</div>
                </div>
                <div className="stats-card">
                    <div className="stats-label">% Активных</div>
                    <div className="stats-value">{stats.percentActive}%</div>
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
                <button className="create-button" onClick={() => setModalOpen(true)}>
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
                </tr>
                </thead>
                <tbody>
                {filteredParameters.map(param => (
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
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="bottom-blocks">
                <div>
                    <div className="bottom-label">Активные параметры</div>
                    <div className="bottom-tags">
                        {activeParams.map(p => (
                            <span className="mini-tag" key={p.id}>{p.name}</span>
                        ))}
                        <span className="mini-tag">+2</span>
                    </div>
                </div>
                <div>
                    <div className="bottom-label">Неактивные параметры</div>
                    <div className="bottom-tags">
                        {inactiveParams.map(p => (
                            <span className="mini-tag" key={p.id}>{p.name}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Модалка */}
            {modalOpen &&
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-window" onClick={e => e.stopPropagation()}>
                        <h3>Создать новый параметр</h3>
                        <form onSubmit={handleAddParameter} className="modal-form">
                            <input
                                required
                                placeholder="Идентификатор"
                                value={newParam.id}
                                onChange={e => setNewParam({...newParam, id: e.target.value})}
                            />
                            <input
                                required
                                placeholder="Значение"
                                value={newParam.value}
                                onChange={e => setNewParam({...newParam, value: e.target.value})}
                            />
                            <input
                                required
                                placeholder="Название"
                                value={newParam.name}
                                onChange={e => setNewParam({...newParam, name: e.target.value})}
                            />
                            <input
                                required
                                placeholder="Описание"
                                value={newParam.description}
                                onChange={e => setNewParam({...newParam, description: e.target.value})}
                            />
                            <select
                                value={newParam.status}
                                onChange={e => setNewParam({...newParam, status: e.target.value})}
                            >
                                <option>Активен</option>
                                <option>Неактивен</option>
                            </select>
                            <div className="modal-actions">
                                <button type="submit" className="create-button">Добавить</button>
                                <button type="button" className="cancel-btn" onClick={() => setModalOpen(false)}>Отмена</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default ParametrsPage;
