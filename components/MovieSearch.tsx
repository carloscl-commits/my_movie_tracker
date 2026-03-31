'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './MovieSearch.module.css';

interface MovieResult {
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string;
  synopsis: string | null;
  genreIds?: number[];
}

interface MovieSearchProps {
  onMovieSelected: (movie: MovieResult) => void;
  isLoading?: boolean;
}

export function MovieSearch({ onMovieSelected, isLoading = false }: MovieSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  // Initialize mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position
  useEffect(() => {
    const updatePosition = () => {
      if (inputRef.current && showResults) {
        const rect = inputRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showResults]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/tmdb/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setShowResults(data.results && data.results.length > 0);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setShowResults(false);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectMovie = useCallback(
    (movie: MovieResult) => {
      onMovieSelected(movie);
      setQuery('');
      setResults([]);
      setShowResults(false);
    },
    [onMovieSelected]
  );

  const dropdownContent = showResults && (
    <div
      className={styles.dropdown}
      style={{
        top: `${dropdownPos.top}px`,
        left: `${dropdownPos.left}px`,
        width: `${dropdownPos.width}px`,
      }}
    >
      {isSearching ? (
        <div className={styles.item}>Searching...</div>
      ) : results.length > 0 ? (
        results.map((movie) => (
          <button
            key={movie.tmdbId}
            className={styles.resultItem}
            onClick={() => handleSelectMovie(movie)}
            disabled={isLoading}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className={styles.poster}
            />
            <div className={styles.info}>
              <div className={styles.title}>{movie.title}</div>
              {movie.year && (
                <div className={styles.year}>({movie.year})</div>
              )}
            </div>
          </button>
        ))
      ) : (
        <div className={styles.item}>No movies found</div>
      )}
    </div>
  );

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className={styles.input}
          disabled={isLoading}
        />
      </div>
      {mounted && dropdownContent && createPortal(dropdownContent, document.body)}
    </>
  );
}
