import React, { useState, useRef, useEffect } from 'react';
import styles from '../../css/ExecutorsPage/MultiSelectDropdown.module.css';

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder, error }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggle = (option) => {
        const isSelected = selectedValues.some(v => v.id === option.id);

        if (isSelected) {
            onChange(selectedValues.filter(v => v.id !== option.id));
        } else {
            onChange([...selectedValues, option]);
        }
    };

    const handleRemoveTag = (optionId, e) => {
        e.stopPropagation();
        onChange(selectedValues.filter(v => v.id !== optionId));
    };

    const isSelected = (option) => {
        return selectedValues.some(v => v.id === option.id);
    };

    return (
        <div className={styles.multiSelect} ref={dropdownRef}>
            <div
                className={`${styles.selectTrigger} ${error ? styles.selectError : ''} ${isOpen ? styles.selectOpen : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className={styles.selectedTags}>
                    {selectedValues.length === 0 ? (
                        <span className={styles.placeholder}>{placeholder}</span>
                    ) : (
                        selectedValues.map(option => (
                            <span key={option.id} className={styles.tag}>
                                {option.name}
                                <button
                                    type="button"
                                    className={styles.tagRemove}
                                    onClick={(e) => handleRemoveTag(option.id, e)}
                                >
                                    ×
                                </button>
                            </span>
                        ))
                    )}
                </div>
                <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.searchContainer}>
                        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3.5-3.5"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className={styles.optionsList}>
                        {filteredOptions.length === 0 ? (
                            <div className={styles.noResults}>Ничего не найдено</div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`${styles.option} ${isSelected(option) ? styles.optionSelected : ''}`}
                                    onClick={() => handleToggle(option)}
                                >
                                    <div className={styles.checkbox}>
                                        {isSelected(option) && (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l2.5 2.5L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className={styles.optionContent}>
                                        <div className={styles.optionName}>{option.name}</div>
                                        <div className={styles.optionDescription}>{option.description}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
