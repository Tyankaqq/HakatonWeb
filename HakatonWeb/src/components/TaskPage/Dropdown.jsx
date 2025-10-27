import React, { useState, useRef, useEffect } from 'react';
import styles from '../../css/TasksToolbar.module.css';

const Dropdown = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button
                className={styles.dropdownButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>

            {isOpen && (
                <div className={styles.dropdownMenu}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.dropdownItem} ${option.value === value ? styles.active : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;