// src/components/ExecutorsPage/EditExecutorModal.jsx
import React, { useState, useEffect } from 'react';
import styles from '../../css/ExecutorsPage/AddExecutorModal.module.css';
import { fetchParameters } from '../../API/ParametrsAPI/ParametrsAPI.js';

const BASE_URL = 'https://a4b0ae7793b5.ngrok-free.app/api/v1';

const EditExecutorModal = ({ isOpen, onClose, onSubmit, executorId }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        status: true,
        daily_limit: 50,
        weight: 3,
        parameters: []
    });

    const [errors, setErrors] = useState({});
    const [availableParameters, setAvailableParameters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [executorLevel, setExecutorLevel] = useState('Junior');
    const [newParameters, setNewParameters] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // Флаг загрузки данных

    useEffect(() => {
        if (isOpen && executorId) {
            setDataLoaded(false);
            loadAllData();
        }
    }, [isOpen, executorId]);

    useEffect(() => {
        const weight = formData.weight;
        if (weight >= 1 && weight <= 3) {
            setExecutorLevel('Junior');
        } else if (weight >= 4 && weight <= 6) {
            setExecutorLevel('Middle');
        } else if (weight >= 7 && weight <= 10) {
            setExecutorLevel('Senior');
        } else {
            setExecutorLevel('Неизвестный');
        }
    }, [formData.weight]);

    // Загружаем и параметры, и данные исполнителя одновременно
    const loadAllData = async () => {
        try {
            setLoading(true);

            // Загружаем параллельно
            const [executorResponse, parametersResponse] = await Promise.all([
                fetch(`${BASE_URL}/users/${executorId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    },
                }),
                fetchParameters()
            ]);

            if (!executorResponse.ok) throw new Error('Ошибка получения данных исполнителя');

            const executorData = await executorResponse.json();
            console.log('Executor data:', executorData);

            let executor = null;
            if (executorData.success && executorData.data) {
                executor = executorData.data;
            } else if (executorData.id) {
                executor = executorData;
            }

            // Обработка параметров
            if (parametersResponse.success && Array.isArray(parametersResponse.data)) {
                const activeParams = parametersResponse.data.filter(p => p.is_active);
                setAvailableParameters(activeParams);
            }

            if (executor) {
                setFormData({
                    first_name: executor.first_name || '',
                    last_name: executor.last_name || '',
                    middle_name: executor.middle_name || '',
                    status: executor.status || false,
                    daily_limit: executor.daily_limit || 50,
                    weight: executor.weight || 3,
                    parameters: executor.parameters || []
                });
                setNewParameters([]);
            }

            setDataLoaded(true);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setLoading(false);
            setDataLoaded(true);
        }
    };

    const renderValueInput = (param, index, isNew = false) => {
        const selectedParameter = availableParameters.find(p => p.id === param.parameter_id);
        const valueType = selectedParameter?.value_type || 'string';

        const commonProps = {
            className: styles.valueInput,
            value: param.value,
            onChange: (e) => isNew ? updateNewParameter(index, 'value', e.target.value) : null,
            required: true,
            disabled: !isNew
        };

        switch (valueType) {
            case 'integer':
                return <input {...commonProps} type="number" step="1" placeholder="Целое число" />;
            case 'float':
                return <input {...commonProps} type="number" step="0.01" placeholder="Число с дробью" />;
            case 'boolean':
                return (
                    <select {...commonProps} className={styles.valueInput}>
                        <option value="">Выберите</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                );
            case 'date':
                return <input {...commonProps} type="date" placeholder="Дата" />;
            case 'datetime':
            case 'timestamp':
                return <input {...commonProps} type="datetime-local" placeholder="Дата и время" />;
            case 'array':
                return <input {...commonProps} type="text" placeholder='["item1", "item2"]' />;
            case 'json':
                return <textarea {...commonProps} className={styles.valueTextarea} placeholder='{"key": "value"}' rows="2" />;
            case 'string':
            default:
                return <input {...commonProps} type="text" placeholder="Текст" />;
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                first_name: '',
                last_name: '',
                middle_name: '',
                status: true,
                daily_limit: 50,
                weight: 3,
                parameters: []
            });
            setNewParameters([]);
            setErrors({});
            setExecutorLevel('Junior');
            setDataLoaded(false);
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'Введите имя';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Введите фамилию';
        }

        if (!formData.daily_limit || formData.daily_limit <= 0) {
            newErrors.daily_limit = 'Укажите дневной лимит';
        }

        if (!formData.weight || formData.weight <= 0 || formData.weight > 10) {
            newErrors.weight = 'Вес должен быть от 1 до 10';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const allParameters = [...formData.parameters, ...newParameters];

            const response = await fetch(`${BASE_URL}/users/${executorId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    ...formData,
                    parameters: allParameters
                })
            });

            if (!response.ok) throw new Error('Ошибка обновления исполнителя');

            const result = await response.json();
            console.log('Update result:', result);

            setLoading(false);
            onSubmit(result);
            onClose();
        } catch (error) {
            console.error('Ошибка обновления исполнителя:', error);
            alert('Ошибка при обновлении исполнителя');
            setLoading(false);
        }
    };

    const addNewParameter = () => {
        setNewParameters([
            ...newParameters,
            { parameter_id: '', value: '', comparison_operator: '=' }
        ]);
    };

    const removeExistingParameter = (index) => {
        const newParams = formData.parameters.filter((_, i) => i !== index);
        setFormData({ ...formData, parameters: newParams });
    };

    const removeNewParameter = (index) => {
        const filtered = newParameters.filter((_, i) => i !== index);
        setNewParameters(filtered);
    };

    const updateNewParameter = (index, field, value) => {
        const updated = [...newParameters];
        updated[index][field] = value;
        setNewParameters(updated);
    };

    const getLevelBadgeStyle = () => {
        switch (executorLevel) {
            case 'Junior':
                return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
            case 'Middle':
                return { backgroundColor: '#FEF3C7', color: '#92400E' };
            case 'Senior':
                return { backgroundColor: '#D1FAE5', color: '#065F46' };
            default:
                return { backgroundColor: '#F3F4F6', color: '#6B7280' };
        }
    };

    const getParameterName = (parameterId) => {
        const param = availableParameters.find(p => p.id === parameterId);
        return param ? `${param.key} (${param.value_type})` : `ID: ${parameterId}`;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Редактировать исполнителя</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <p className={styles.modalSubtitle}>Измените данные исполнителя</p>

                {!dataLoaded ? (
                    <div className={styles.loadingState}>Загрузка данных...</div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.modalForm}>
                        {/* Имя */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Имя *</label>
                            <input
                                type="text"
                                className={`${styles.formInput} ${errors.first_name ? styles.inputError : ''}`}
                                placeholder="Введите имя"
                                value={formData.first_name}
                                onChange={(e) => {
                                    setFormData({ ...formData, first_name: e.target.value });
                                    if (errors.first_name) setErrors({ ...errors, first_name: null });
                                }}
                            />
                            {errors.first_name && (
                                <span className={styles.errorText}>{errors.first_name}</span>
                            )}
                        </div>

                        {/* Фамилия */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Фамилия *</label>
                            <input
                                type="text"
                                className={`${styles.formInput} ${errors.last_name ? styles.inputError : ''}`}
                                placeholder="Введите фамилию"
                                value={formData.last_name}
                                onChange={(e) => {
                                    setFormData({ ...formData, last_name: e.target.value });
                                    if (errors.last_name) setErrors({ ...errors, last_name: null });
                                }}
                            />
                            {errors.last_name && (
                                <span className={styles.errorText}>{errors.last_name}</span>
                            )}
                        </div>

                        {/* Отчество */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Отчество</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                placeholder="Введите отчество"
                                value={formData.middle_name}
                                onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                            />
                        </div>

                        {/* Дневной лимит и Вес */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Дневной лимит *</label>
                                <input
                                    type="number"
                                    className={`${styles.formInput} ${errors.daily_limit ? styles.inputError : ''}`}
                                    placeholder="50"
                                    value={formData.daily_limit}
                                    onChange={(e) => {
                                        setFormData({ ...formData, daily_limit: parseInt(e.target.value) || 0 });
                                        if (errors.daily_limit) setErrors({ ...errors, daily_limit: null });
                                    }}
                                />
                                {errors.daily_limit && (
                                    <span className={styles.errorText}>{errors.daily_limit}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Вес *
                                    <span
                                        className={styles.levelBadge}
                                        style={getLevelBadgeStyle()}
                                    >
                                        {executorLevel}
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    className={`${styles.formInput} ${errors.weight ? styles.inputError : ''}`}
                                    placeholder="3"
                                    value={formData.weight}
                                    onChange={(e) => {
                                        setFormData({ ...formData, weight: parseInt(e.target.value) || 1 });
                                        if (errors.weight) setErrors({ ...errors, weight: null });
                                    }}
                                />
                                {errors.weight && (
                                    <span className={styles.errorText}>{errors.weight}</span>
                                )}
                                <p className={styles.helperText}>
                                    1-3: Junior | 4-6: Middle | 7-10: Senior
                                </p>
                            </div>
                        </div>

                        {/* Статус */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Статус</label>
                            <select
                                className={styles.formInput}
                                value={formData.status ? 'active' : 'inactive'}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value === 'active' })}
                            >
                                <option value="active">Активен</option>
                                <option value="inactive">Неактивен</option>
                            </select>
                        </div>

                        {/* Существующие параметры */}
                        {formData.parameters.length > 0 && (
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Текущие параметры</label>
                                <p className={styles.helperText}>
                                    Существующие параметры нельзя редактировать, только удалить
                                </p>
                                {formData.parameters.map((param, index) => (
                                    <div key={`existing-${index}`} className={styles.existingParameterCard}>
                                        <div className={styles.existingParameterInfo}>
                                            <strong>{getParameterName(param.parameter_id)}</strong>
                                            <span className={styles.operatorBadge}>{param.comparison_operator}</span>
                                            <span>{param.value}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.removeParameterButton}
                                            onClick={() => removeExistingParameter(index)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Новые параметры */}
                        <div className={styles.formGroup}>
                            <div className={styles.parametersHeader}>
                                <label className={styles.formLabel}>Добавить новые параметры</label>
                                <button
                                    type="button"
                                    className={styles.addParameterButton}
                                    onClick={addNewParameter}
                                >
                                    + Добавить параметр
                                </button>
                            </div>

                            {newParameters.length === 0 && formData.parameters.length === 0 && (
                                <p className={styles.helperText}>
                                    Нажмите "Добавить параметр" для настройки
                                </p>
                            )}

                            {newParameters.map((param, index) => (
                                <div key={`new-${index}`} className={styles.parameterCard}>
                                    <div className={styles.parameterGrid}>
                                        <div className={styles.parameterColumn}>
                                            <label className={styles.parameterLabel}>Параметр</label>
                                            <select
                                                className={styles.parameterSelect}
                                                value={param.parameter_id}
                                                onChange={(e) => {
                                                    updateNewParameter(index, 'parameter_id', parseInt(e.target.value));
                                                    updateNewParameter(index, 'value', '');
                                                }}
                                            >
                                                <option value="">Выберите параметр</option>
                                                {availableParameters.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.key} ({p.value_type})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className={styles.parameterColumn}>
                                            <label className={styles.parameterLabel}>Оператор</label>
                                            <select
                                                className={styles.operatorSelect}
                                                value={param.comparison_operator}
                                                onChange={(e) => updateNewParameter(index, 'comparison_operator', e.target.value)}
                                            >
                                                <option value="=">=</option>
                                                <option value="!=">!=</option>
                                                <option value=">">{'>'}</option>
                                                <option value="<">{'<'}</option>
                                                <option value=">=">{'>='}</option>
                                                <option value="<=">{'<='}</option>
                                            </select>
                                        </div>

                                        <div className={styles.ValueParameterColumn}>
                                            <label className={styles.parameterLabel}>Значение</label>
                                            {renderValueInput(param, index, true)}
                                            <button
                                                type="button"
                                                className={styles.removeParameterButton}
                                                onClick={() => removeNewParameter(index)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Действия */}
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={onClose}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={loading}
                            >
                                {loading ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditExecutorModal;
