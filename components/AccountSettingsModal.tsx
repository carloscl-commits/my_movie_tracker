'use client';

import { FormEvent, useState } from 'react';
import { signOut } from 'next-auth/react';
import styles from './AccountSettingsModal.module.css';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
}: AccountSettingsModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword('');
    setNewUsername('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    if (!newUsername && !newPassword) {
      setError('Enter a new username or password');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update credentials');
        setIsLoading(false);
        return;
      }

      setSuccess('Credentials updated! You will be signed out.');
      setIsLoading(false);

      // Sign out after a short delay so user sees the success message
      setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 1500);
    } catch {
      setError('Failed to update credentials. Please try again.');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Account Settings</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.content}>
          <div className={styles.section}>
            <label className={styles.label} htmlFor="currentPassword">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              className={styles.input}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <label className={styles.label} htmlFor="newUsername">
              New Username
            </label>
            <input
              id="newUsername"
              type="text"
              className={styles.input}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Leave empty to keep current"
              disabled={isLoading}
              minLength={3}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave empty to keep current"
              disabled={isLoading}
              minLength={4}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              disabled={isLoading || !newPassword}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>{success}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || !currentPassword}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </>
  );
}
