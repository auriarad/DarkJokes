"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useController } from 'react-hook-form';
import { Search, X } from 'lucide-react';
import styles from '@/styles/MultiSelect.module.css';

const MultiSelect = ({
    maxSelected = 3,
    name,
    control,
    options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    rules
}) => {
    const {
        field: { value, onChange },
        fieldState: { error }
    } = useController({
        name,
        control,
        rules,
        defaultValue: []
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const filteredOptions = options.filter(
        option =>
            !value.includes(option) &&
            option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setHighlightedIndex(0);
    }, [searchTerm]);

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    Math.min(prev + 1, filteredOptions.length - 1)
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    handleSelect(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Backspace':
                if (!searchTerm && value.length > 0) {
                    handleRemove(value[value.length - 1]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (item) => {
        onChange([...value, item]);
        setSearchTerm('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleRemove = (item) => {
        onChange(value.filter((i) => i !== item));
        inputRef.current?.focus();
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.selectedBox} onClick={() => inputRef.current?.focus()}>
                {value.map((item) => (
                    <span key={item} className={styles.tag}>
                        #{item}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(item);
                            }}
                            className={styles.removeButton}
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <div className={styles.inputContainer}>
                    <Search size={16} />
                    <input
                        id={name}
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        className={styles.input}
                        placeholder={value.length === 0 ? "בחר קטגוריות..." : ""}
                    />
                </div>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {filteredOptions.length > 0 ? (
                        <ul className={styles.Ul}>
                            {filteredOptions.map((option, index) => (
                                <li
                                    key={option}
                                    onClick={() => handleSelect(option)}
                                    className={`${styles.option} ${index === highlightedIndex ? styles.highlighted : ''
                                        }`}
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={styles.noMatches}>
                            לא נמצאה קטגוריה
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
