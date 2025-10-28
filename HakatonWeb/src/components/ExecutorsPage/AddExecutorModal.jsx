// src/components/ExecutorsPage/AddExecutorModal.jsx
import React, { useState, useEffect } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import styles from '../../css/ExecutorsPage/AddExecutorModal.module.css';
import { fetchParameters } from '../../API/ParametrsAPI/ParametrsAPI.js';

const AddExecutorModal = ({ isOpen, onClose, onSubmit }) => {
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

    useEffect(() => {
        if (isOpen) {
            loadParameters();
        }
    }, [isOpen]);

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

    const loadParameters = async () => {
        try {
            setLoading(true);
            const response = await fetchParameters();

            if (response.success && Array.isArray(response.data)) {
                const activeParams = response.data.filter(p => p.is_active);
                setAvailableParameters(activeParams);
            }
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки параметров:', error);
            setLoading(false);
        }
    };

    const renderValueInput = (param, index) => {
        const selectedParameter = availableParameters.find(p => p.id === param.parameter_id);
        const valueType = selectedParameter?.value_type || 'string';

        const commonProps = {
            className: styles.valueInput,
            value: param.value,
            onChange: (e) => updateParameter(index, 'value', e.target.value),
            required: true
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
            setErrors({});
            setExecutorLevel('Junior');
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

        if (formData.parameters.length === 0) {
            newErrors.parameters = 'Добавьте хотя бы один параметр';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Форматируем данные перед отправкой
            const formattedData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                middle_name: formData.middle_name || '',
                status: formData.status,
                daily_limit: formData.daily_limit,
                weight: formData.weight,
                parameters: formData.parameters.map(param => ({
                    parameter_id: parseInt(param.parameter_id),
                    value: param.value.toString(),
                    comparison_operator: param.comparison_operator
                }))
            };

            console.log('Отправляемые данные из модалки:', formattedData);
            onSubmit(formattedData);
        }
    };

    const addParameter = () => {
        setFormData({
            ...formData,
            parameters: [
                ...formData.parameters,
                { parameter_id: '', value: '', comparison_operator: '=' }
            ]
        });
    };

    const removeParameter = (index) => {
        const newParameters = formData.parameters.filter((_, i) => i !== index);
        setFormData({ ...formData, parameters: newParameters });
    };

    const updateParameter = (index, field, value) => {
        const newParameters = [...formData.parameters];
        newParameters[index][field] = value;
        setFormData({ ...formData, parameters: newParameters });

        if (errors.parameters) {
            setErrors({ ...errors, parameters: null });
        }
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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Новый исполнитель</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <p className={styles.modalSubtitle}>Добавьте нового исполнителя в систему</p>

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

                    {/* Дневной лимит и Вес в одной строке */}
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

                    {/* Параметры */}
                    <div className={styles.formGroup}>
                        <div className={styles.parametersHeader}>
                            <label className={styles.formLabel}>Параметры *</label>
                            <button
                                type="button"
                                className={styles.addParameterButton}
                                onClick={addParameter}
                                disabled={loading}
                            >
                                + Добавить параметр
                            </button>
                        </div>

                        {formData.parameters.length === 0 && (
                            <p className={styles.helperText}>
                                Нажмите "Добавить параметр" для настройки
                            </p>
                        )}

                        {formData.parameters.map((param, index) => (
                            <div key={index} className={styles.parameterCard}>
                                <div className={styles.parameterGrid}>
                                    <div className={styles.parameterColumn}>
                                        <label className={styles.parameterLabel}>Параметр</label>
                                        <select
                                            className={styles.parameterSelect}
                                            value={param.parameter_id}
                                            onChange={(e) => {
                                                updateParameter(index, 'parameter_id', parseInt(e.target.value));
                                                updateParameter(index, 'value', '');
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
                                            onChange={(e) => updateParameter(index, 'comparison_operator', e.target.value)}
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
                                        {renderValueInput(param, index)}
                                        <button
                                            type="button"
                                            className={styles.removeParameterButton}
                                            onClick={() => removeParameter(index)}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {errors.parameters && (
                            <span className={styles.errorText}>{errors.parameters}</span>
                        )}
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
                        >
                            Добавить {executorLevel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExecutorModal;
