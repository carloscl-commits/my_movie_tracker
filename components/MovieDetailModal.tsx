'use client';

import { useState, useEffect } from 'react';
import styles from './MovieDetailModal.module.css';

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  year: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  genres: string | null;
  personalRating: number | null;
  status: string;
  favorite: boolean;
  createdAt: string;
}

interface MovieDetailModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onMovieUpdated: () => void;
}

export function MovieDetailModal({
  movie,
  isOpen,
  onClose,
  onMovieUpdated,
}: MovieDetailModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localMovie, setLocalMovie] = useState<Movie | null>(movie);

  // Update localMovie when movie prop changes
  useEffect(() => {
    if (movie) {
      setLocalMovie(movie);
    }
  }, [movie?.id, movie]);

  const handleRatingChange = async (rating: number | null) => {
    if (!localMovie) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${localMovie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalRating: rating }),
      });

      if (!response.ok) throw new Error('Failed to update rating');

      const data = await response.json();
      setLocalMovie(data.movie);
      onMovieUpdated();
    } catch (err) {
      console.error('Error updating rating:', err);
      setError('Failed to update rating');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!localMovie) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${localMovie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();
      setLocalMovie(data.movie);
      onMovieUpdated();
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!localMovie) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${localMovie.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !localMovie.favorite }),
      });

      if (!response.ok) throw new Error('Failed to update favorite');

      const data = await response.json();
      setLocalMovie(data.movie);
      onMovieUpdated();
    } catch (err) {
      console.error('Error updating favorite:', err);
      setError('Failed to update favorite');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!localMovie || !confirm('Are you sure you want to delete this movie?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/movies/${localMovie.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete movie');

      onMovieUpdated();
      onClose();
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError('Failed to delete movie');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !localMovie) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          disabled={isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.content}>
          {localMovie.posterUrl && (
            <img
              src={localMovie.posterUrl}
              alt={localMovie.title}
              className={styles.poster}
            />
          )}

          <div className={styles.info}>
            <h2 className={styles.title}>{localMovie.title}</h2>

            {localMovie.year && (
              <p className={styles.year}>{localMovie.year}</p>
            )}

            {localMovie.synopsis && (
              <p className={styles.synopsis}>{localMovie.synopsis}</p>
            )}

            <div className={styles.section}>
              <label className={styles.label}>Rating</label>
              <div className={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`${styles.starButton} ${
                      (localMovie.personalRating || 0) >= rating ? styles.active : ''
                    }`}
                    onClick={() => handleRatingChange(rating)}
                    disabled={isLoading}
                    title={`${rating} star${rating !== 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
                {localMovie.personalRating && (
                  <button
                    className={styles.clearRating}
                    onClick={() => handleRatingChange(null)}
                    disabled={isLoading}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>Status</label>
              <div className={styles.statusRow}>
                <div className={styles.statusButtons}>
                  <button
                    className={`${styles.statusButton} ${
                      localMovie.status === 'unseen' ? styles.active : ''
                    }`}
                    onClick={() => handleStatusChange('unseen')}
                    disabled={isLoading}
                    title="Unseen"
                  >
                    <span className={styles.statusIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    </span>
                  </button>
                  <button
                    className={`${styles.statusButton} ${
                      localMovie.status === 'seen' ? styles.active : ''
                    }`}
                    onClick={() => handleStatusChange('seen')}
                    disabled={isLoading}
                    title="Seen"
                  >
                    <span className={styles.statusIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                  </button>
                </div>
                <button
                  className={`${styles.favoriteButton} ${
                    localMovie.favorite ? styles.active : ''
                  }`}
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  title={localMovie.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={styles.statusIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={localMovie.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              disabled={isLoading}
            >
              Delete Movie
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
