'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { AddMovieModal } from '@/components/AddMovieModal';
import { MovieDetailModal } from '@/components/MovieDetailModal';
import { ThemeCustomizer } from '@/components/ThemeCustomizer';
import { MovieSidebar } from '@/components/MovieSidebar';
import { useGenres } from '@/lib/useGenres';
import styles from './page.module.css';

interface Movie {
  id: number;
  tmdbId: number;
  title: string;
  year: number | null;
  synopsis: string | null;
  posterUrl: string | null;
  genres: string | null; // JSON string of genre IDs
  personalRating: number | null;
  status: string;
  favorite: boolean;
  createdAt: string;
}

interface Filter {
  status: string | null;
  genreId: number | null;
}

export default function Home() {
  const { getGenreNames } = useGenres();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<Filter>({ status: null, genreId: null });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, allMovies]);

  const loadMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/movies');
      if (response.ok) {
        const data = await response.json();
        setAllMovies(data.movies || []);
      } else {
        setError('Failed to load movies');
      }
    } catch (err) {
      console.error('Failed to load movies:', err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allMovies];

    // Filter by status or favorite
    if (filter.status === 'favorite') {
      filtered = filtered.filter((m) => m.favorite);
    } else if (filter.status) {
      filtered = filtered.filter((m) => m.status === filter.status);
    }

    // Filter by genre
    if (filter.genreId) {
      filtered = filtered.filter((m) => {
        if (!m.genres) return false;
        try {
          const genreIds = JSON.parse(m.genres);
          return genreIds.includes(filter.genreId);
        } catch {
          return false;
        }
      });
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (newFilter: Filter) => {
    setFilter(newFilter);
  };

  return (
    <main className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>My Movie Tracker</h1>
        <div className={styles.topBarActions}>
          <ThemeCustomizer />
          <button
            className={styles.logoutButton}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <MovieSidebar
          onFilterChange={handleFilterChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <div className={styles.gallery}>
          <div className={styles.galleryHeader}>
            <button
              className={styles.addButton}
              onClick={() => setIsAddModalOpen(true)}
            >
              + Add Movie
            </button>
            <div className={styles.movieCount}>
              {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
              <button
                className={styles.retryButton}
                onClick={loadMovies}
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div className={styles.loading}>Loading movies...</div>
          ) : filteredMovies.length === 0 ? (
            <div className={styles.empty}>
              <p>
                {allMovies.length === 0
                  ? 'No movies yet. Add one to get started!'
                  : 'No movies match your filters.'}
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredMovies.map((movie) => (
                <button
                  key={movie.id}
                  className={styles.card}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsDetailModalOpen(true);
                  }}
                >
                  {movie.posterUrl && (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className={styles.poster}
                    />
                  )}
                  <div className={styles.cardInfo}>
                    <h3 className={styles.movieTitle}>{movie.title}</h3>
                    {movie.year && (
                      <p className={styles.year}>{movie.year}</p>
                    )}
                    {movie.genres && (
                      <div className={styles.genres}>
                        {getGenreNames(JSON.parse(movie.genres))
                          .slice(0, 2)
                          .map((g, idx) => (
                            <span key={`${movie.id}-genre-${idx}`} className={styles.genreTag}>
                              {g}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className={styles.badgeRow}>
                      <span className={styles.badge} title={movie.status}>
                        {movie.status === 'seen' ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        )}
                      </span>
                      {movie.favorite && (
                        <span className={styles.favoriteBadge} title="Favorite">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddMovieModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onMovieAdded={loadMovies}
      />

      <MovieDetailModal
        movie={selectedMovie}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMovie(null);
        }}
        onMovieUpdated={loadMovies}
      />
    </main>
  );
}
