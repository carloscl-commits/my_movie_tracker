'use client';

import { useState } from 'react';
import { useGenres } from '@/lib/useGenres';
import styles from './MovieSidebar.module.css';

interface Filter {
  status: string | null;
  genreId: number | null;
}

interface MovieSidebarProps {
  onFilterChange: (filter: Filter) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AllIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </svg>
);

const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const GenreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const statusFilters = [
  { key: null, label: 'All', Icon: AllIcon },
  { key: 'favorite', label: 'Favorites', Icon: HeartIcon },
  { key: 'seen', label: 'Seen', Icon: EyeIcon },
  { key: 'unseen', label: 'Unseen', Icon: EyeOffIcon },
] as const;

export function MovieSidebar({
  onFilterChange,
  isCollapsed,
  onToggleCollapse,
}: MovieSidebarProps) {
  const { genres, isLoading } = useGenres();
  const [filter, setFilter] = useState<Filter>({
    status: null,
    genreId: null,
  });

  const handleStatusChange = (status: string | null) => {
    const newFilter = { ...filter, status };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleGenreChange = (genreId: number | null) => {
    const newFilter = { ...filter, genreId };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <button
        className={styles.collapseButton}
        onClick={onToggleCollapse}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>

      <div className={styles.section}>
        {!isCollapsed && <h3 className={styles.sectionTitle}>Filters</h3>}

        <div className={styles.filterGroup}>
          {!isCollapsed && <label className={styles.label}>Status</label>}
          <div className={styles.options}>
            {statusFilters.map(({ key, label, Icon }) => (
              <button
                key={label}
                className={`${isCollapsed ? styles.iconButton : styles.filterOption} ${
                  filter.status === key ? styles.active : ''
                }`}
                onClick={() => handleStatusChange(key)}
                title={label}
              >
                {isCollapsed ? (
                  <Icon />
                ) : (
                  <>
                    <span className={styles.filterIcon}><Icon /></span>
                    {label}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {!isLoading && genres.length > 0 && (
          <div className={styles.filterGroup}>
            {isCollapsed ? (
              <div className={styles.options}>
                <button
                  className={`${styles.iconButton} ${
                    filter.genreId === null ? '' : styles.active
                  }`}
                  onClick={() => handleGenreChange(null)}
                  title={filter.genreId ? 'Clear genre filter' : 'Genres'}
                >
                  <GenreIcon />
                </button>
              </div>
            ) : (
              <>
                <label className={styles.label}>Genre</label>
                <div className={styles.options}>
                  <button
                    className={`${styles.filterOption} ${
                      filter.genreId === null ? styles.active : ''
                    }`}
                    onClick={() => handleGenreChange(null)}
                  >
                    <span className={styles.filterIcon}><GenreIcon /></span>
                    All
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      className={`${styles.filterOption} ${
                        filter.genreId === genre.id ? styles.active : ''
                      }`}
                      onClick={() => handleGenreChange(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
