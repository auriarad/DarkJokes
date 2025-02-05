'use client';

import styles from '@/styles/SideBar.module.css'
import { useForm } from 'react-hook-form';
import { ArrowUpFromLine, ArrowDownFromLine, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { categories } from '../../../public/categories';
import CategoryBadge from '../jokes/CategoriesBadge';

export default function SideBar({ handleSearch }) {
    const isInitialMount = useRef(true);
    const [sortOrder, setSortOrder] = useState('descending');
    const [chosenCategories, setChosenCategories] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const { register, watch } = useForm({
        defaultValues: {
            search: '',
            sort: ''
        }
    });
    const formValues = watch();

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        handleSearch(
            {
                ...formValues,
                sortOrder,
                chosenCategories
            });
    },
        [
            formValues.sort,
            formValues.search,
            sortOrder,
            chosenCategories
        ]);

    const handleChosenCategories = (category) => {
        if (chosenCategories.includes(category)) {
            setChosenCategories(curr => curr.filter(cat => cat !== category));
        } else {
            setChosenCategories(curr => [...curr, category])
        }
    }

    const toggleSidebar = () => {
        setIsOpen(curr => !curr);
    };


    return (
        <>

            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                onClick={toggleSidebar}
            />

            <div className={`${styles.container} ${isOpen ? styles.open : ''}`}>


                <button
                    onClick={toggleSidebar}
                    className={styles.menuButton}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`${styles.sideBarContent} ${isOpen ? styles.open : ''}`}>
                    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="sort">מיין:</label>
                        <span>
                            <select id='sort' {...register("sort")}>
                                <option value="">ברירת מחדל</option>
                                <option value="createdAt">תאריך</option>
                                <option value="rating">דירוג</option>
                                <option value="comments">תגובות</option>
                                <option value="controversial">שנוי במחלוקת</option>
                            </select>
                            <button
                                type="button"
                                className={styles.reverse}
                                onClick={() => setSortOrder(curr => curr === "descending" ? 'ascending' : 'descending')}
                            >
                                {sortOrder === "ascending" ? <ArrowUpFromLine /> : <ArrowDownFromLine />}
                            </button>
                        </span>

                        <label htmlFor="search">חפש:</label>
                        <input
                            id='search'
                            type="search"
                            placeholder="משהו מצחיק"
                            {...register("search")}
                        />
                    </form>

                    <div className={styles.categoriesGrid}>
                        {categories.map(category => (
                            <button
                                className={styles.categorieButt}
                                key={category}
                                onClick={() => handleChosenCategories(category)}
                            >
                                <CategoryBadge
                                    varinat={chosenCategories.includes(category) ? 'choosen' : 'default'}
                                >
                                    #{category}
                                </CategoryBadge>
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}
