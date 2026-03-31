'use client';

import { useEffect, useState } from 'react';

export interface Genre {
  id: number;
  name: string;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/tmdb/genres');
        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres || []);
        }
      } catch (error) {
        console.error('Failed to load genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const getGenreNames = (genreIds: number[]): string[] => {
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  return { genres, isLoading, getGenreNames };
}
