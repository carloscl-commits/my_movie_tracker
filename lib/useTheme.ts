'use client';

import { useEffect, useState } from 'react';

export interface Theme {
  theme: 'light' | 'dark';
  accentColor: string;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from API on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch('/api/preferences');
        if (response.ok) {
          const data = await response.json();
          const preferences = data.preferences;
          if (preferences) {
            setTheme({
              theme: preferences.theme || 'light',
              accentColor: preferences.accentColor || '#3b82f6',
            });
            applyTheme(preferences.theme || 'light', preferences.accentColor || '#3b82f6');
          }
        } else {
          // Set default theme if API fails
          setTheme({ theme: 'light', accentColor: '#3b82f6' });
          applyTheme('light', '#3b82f6');
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
        // Set default theme on error
        setTheme({ theme: 'light', accentColor: '#3b82f6' });
        applyTheme('light', '#3b82f6');
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  const applyTheme = (themeName: 'light' | 'dark', accentColor: string) => {
    const root = document.documentElement;

    if (themeName === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    root.style.setProperty('--accent-color', accentColor);
  };

  const updateTheme = async (newTheme: Partial<Theme>) => {
    if (!theme) return;

    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheme),
      });

      if (response.ok) {
        const data = await response.json();
        const preferences = data.preferences;
        const updated = {
          theme: preferences.theme,
          accentColor: preferences.accentColor,
        };
        setTheme(updated);
        applyTheme(preferences.theme, preferences.accentColor);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return {
    theme,
    isLoading,
    updateTheme,
  };
}
