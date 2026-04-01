'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/useTheme';
import styles from './ThemeCustomizer.module.css';

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
];

export function ThemeCustomizer() {
  const { theme, isLoading, updateTheme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState('#3b82f6');

  const handleToggleTheme = () => {
    if (!theme) return;
    updateTheme({
      theme: theme.theme === 'light' ? 'dark' : 'light',
    });
  };

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    updateTheme({ accentColor: color });
    setShowColorPicker(false);
  };

  const handleCustomColor = (color: string) => {
    setCustomColor(color);
    // Only update if valid hex color
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      updateTheme({ accentColor: color });
    }
  };

  if (!theme || isLoading) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.themeToggle}
        onClick={handleToggleTheme}
        title={`Switch to ${theme.theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme.theme === 'light' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>

      <div className={styles.colorPickerWrapper}>
        <button
          className={styles.colorButton}
          style={{ backgroundColor: theme.accentColor }}
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Change accent color"
        />

        {showColorPicker && (
          <div className={styles.colorPicker}>
            <div className={styles.presets}>
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={`${styles.colorSwatch} ${
                    theme.accentColor === color ? styles.active : ''
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                />
              ))}
            </div>

            <div className={styles.customColorInput}>
              <input
                type="color"
                value={customColor}
                onChange={(e) => handleCustomColor(e.target.value)}
                className={styles.nativeColorPicker}
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => handleCustomColor(e.target.value)}
                placeholder="#000000"
                className={styles.hexInput}
                maxLength={7}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
