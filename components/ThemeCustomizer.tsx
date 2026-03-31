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
        {theme.theme === 'light' ? '🌙' : '☀️'}
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
