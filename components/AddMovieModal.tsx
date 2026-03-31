'use client';

import { useState } from 'react';
import { MovieSearch } from './MovieSearch';
import styles from './AddMovieModal.module.css';

interface MovieResult {
  tmdbId: number;
  title: string;
  year: number | null;
  posterUrl: string;
  synopsis: string | null;
  genreIds?: number[];
}

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMovieAdded: () => void;
}

export function AddMovieModal({
  isOpen,
  onClose,
  onMovieAdded,
}: AddMovieModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMovieSelected = async (movie: MovieResult) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.tmdbId,
          title: movie.title,
          year: movie.year,
          posterUrl: movie.posterUrl,
          synopsis: movie.synopsis,
          genreIds: movie.genreIds || [],
        }),
      });

      if (response.status === 409) {
        setError('This movie is already in your collection');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add movie');
      }

      onMovieAdded();
      onClose();
    } catch (err) {
      console.error('Error adding movie:', err);
      setError('Failed to add movie. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Movie</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <MovieSearch
            onMovieSelected={handleMovieSelected}
            isLoading={isLoading}
          />

          {error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </>
  );
}
