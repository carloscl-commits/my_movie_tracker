'use client';

import { useState, useEffect } from 'react';
import { useGenres } from '@/lib/useGenres';
import styles from './MovieSidebar.module.css';

interface Filter {
  status: string | null; // 'unseen', 'seen', 'favorite' (filters by favorite field), or null for all
  genreId: number | null;
}

interface MovieSidebarProps {
  onFilterChange: (filter: Filter) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

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
        {isCollapsed ? '▶' : '◀'}
      </button>

      {!isCollapsed && (
        <>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Filters</h3>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Status</label>
              <div className={styles.options}>
                <button
                  className={`${styles.filterOption} ${
                    filter.status === null ? styles.active : ''
                  }`}
                  onClick={() => handleStatusChange(null)}
                >
                  All
                </button>
                <button
                  className={`${styles.filterOption} ${
                    filter.status === 'favorite' ? styles.active : ''
                  }`}
                  onClick={() => handleStatusChange('favorite')}
                >
                  Favorites
                </button>
                <button
                  className={`${styles.filterOption} ${
                    filter.status === 'seen' ? styles.active : ''
                  }`}
                  onClick={() => handleStatusChange('seen')}
                >
                  Seen
                </button>
                <button
                  className={`${styles.filterOption} ${
                    filter.status === 'unseen' ? styles.active : ''
                  }`}
                  onClick={() => handleStatusChange('unseen')}
                >
                  Unseen
                </button>
              </div>
            </div>

            {!isLoading && genres.length > 0 && (
              <div className={styles.filterGroup}>
                <label className={styles.label}>Genre</label>
                <div className={styles.options}>
                  <button
                    className={`${styles.filterOption} ${
                      filter.genreId === null ? styles.active : ''
                    }`}
                    onClick={() => handleGenreChange(null)}
                  >
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
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
}
