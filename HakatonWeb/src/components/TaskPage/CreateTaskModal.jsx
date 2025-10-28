import React, { useState, useEffect } from 'react';
import styles from '../../css/TaskPage/CreateTaskModal.module.css';

const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: ''
    });

    const [errors, setErrors] = useState({});

    const priorityOptions = [
        { value: 'high', label: 'Высокий' },
        { value: 'medium', label: 'Средний' },
        { value: 'low', label: 'Низкий' }
    ];

    useEffect(() => {
        if (!isOpen) {
            setFormData({ title: '', description: '', priority: '' });
            setErrors({});
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Введите название задачи';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Введите описание задачи';
        }

        if (!formData.priority) {
            newErrors.priority = 'Выберите приоритет';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalWindow} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Новая задача</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <p className={styles.modalSubtitle}>Создайте новую задачу для исполнителя</p>

                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    {/* Название */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Название</label>
                        <input
                            type="text"
                            className={`${styles.formInput} ${errors.title ? styles.inputError : ''}`}
                            placeholder="Введите название задачи"
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value });
                                if (errors.title) setErrors({ ...errors, title: null });
                            }}
                        />
                        {errors.title && (
                            <span className={styles.errorText}>{errors.title}</span>
                        )}
                    </div>

                    {/* Описание */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Описание</label>
                        <textarea
                            className={`${styles.formTextarea} ${errors.description ? styles.inputError : ''}`}
                            placeholder="Введите описание задачи"
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({ ...formData, description: e.target.value });
                                if (errors.description) setErrors({ ...errors, description: null });
                            }}
                            rows={4}
                        />
                        {errors.description && (
                            <span className={styles.errorText}>{errors.description}</span>
                        )}
                    </div>

                    {/* Приоритет */}
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Приоритет</label>
                        <select
                            className={`${styles.formSelect} ${errors.priority ? styles.inputError : ''}`}
                            value={formData.priority}
                            onChange={(e) => {
                                setFormData({ ...formData, priority: e.target.value });
                                if (errors.priority) setErrors({ ...errors, priority: null });
                            }}
                        >
                            <option value="">Выберите</option>
                            {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.priority && (
                            <span className={styles.errorText}>{errors.priority}</span>
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
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
