import React from 'react';
import styles from '../../css/ExecutorsPage/ExecutorsPage.module.css';

const SearchInput = ({ value, onChange, placeholder }) => {
    return (
        <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7 12A5 5 0 1 0 7 2a5 5 0 0 0 0 10zM14 14l-3.5-3.5"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
                type="text"
                className={styles.searchInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
};

export default SearchInput;