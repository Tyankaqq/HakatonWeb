import React, { useState, useEffect } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import styles from '../../css/ExecutorsPage/AddExecutorModal.module.css';



const AddExecutorModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: '',
        skills: []
    });

    const [errors, setErrors] = useState({});

    // Локальный массив параметров (такой же как в ParametrsPage)
    const availableSkills = [
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
        { id: 'docker', value: 'Docker', name: 'Docker', description: 'Контейнизация приложений', status: 'Активен' },
        { id: 'kubernetes', value: 'Kubernetes', name: 'Kubernetes', description: 'Оркестрация контейнеров', status: 'Неактивен' }
    ].filter(skill => skill.status === 'Активен'); // Показываем только активные


    useEffect(() => {
        if (!isOpen) {
            setFormData({ fullName: '', email: '', role: '', skills: [] });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Введите ФИО';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Некорректный email';
        }

        if (!formData.role) {
            newErrors.role = 'Выберите роль';
        }

        if (formData.skills.length === 0) {
            newErrors.skills = 'Выберите хотя бы один навык';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleSkillsChange = (selectedSkills) => {
        setFormData({ ...formData, skills: selectedSkills });
        if (errors.skills) {
            setErrors({ ...errors, skills: null });
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
                    {/* ФИО */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>ФИО</label>
                        <input
                            type="text"
                            className={`${styles.formInput} ${errors.fullName ? styles.inputError : ''}`}
                            placeholder="Введите ФИО"
                            value={formData.fullName}
                            onChange={(e) => {
                                setFormData({ ...formData, fullName: e.target.value });
                                if (errors.fullName) setErrors({ ...errors, fullName: null });
                            }}
                        />
                        {errors.fullName && (
                            <span className={styles.errorText}>{errors.fullName}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                            placeholder="email@company.com"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value });
                                if (errors.email) setErrors({ ...errors, email: null });
                            }}
                        />
                        {errors.email && (
                            <span className={styles.errorText}>{errors.email}</span>
                        )}
                    </div>



                    {/* Параметры и навыки */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Параметры и навыки</label>
                        <MultiSelectDropdown
                            options={availableSkills}
                            selectedValues={formData.skills}
                            onChange={handleSkillsChange}
                            placeholder="Выберите параметры..."
                            error={errors.skills}
                        />
                        {errors.skills && (
                            <span className={styles.errorText}>{errors.skills}</span>
                        )}
                        <p className={styles.helperText}>
                            Выберите навыки и специализации исполнителя
                        </p>
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
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExecutorModal;
