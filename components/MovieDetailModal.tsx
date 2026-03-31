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
          ✕
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
                  {([
                    { key: 'unseen', icon: '👁️‍🗨️', label: 'Unseen' },
                    { key: 'seen', icon: '👁️', label: 'Seen' },
                  ] as const).map(({ key, icon, label }) => (
                    <button
                      key={key}
                      className={`${styles.statusButton} ${
                        localMovie.status === key ? styles.active : ''
                      }`}
                      onClick={() => handleStatusChange(key)}
                      disabled={isLoading}
                      title={label}
                    >
                      <span className={styles.statusIcon}>{icon}</span>
                    </button>
                  ))}
                </div>
                <button
                  className={`${styles.favoriteButton} ${
                    localMovie.favorite ? styles.active : ''
                  }`}
                  onClick={handleFavoriteToggle}
                  disabled={isLoading}
                  title={localMovie.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <span className={styles.statusIcon}>❤️</span>
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
