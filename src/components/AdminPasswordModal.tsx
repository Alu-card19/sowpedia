'use client'

import { useEffect, useState } from 'react'
import styles from './AdminPasswordModal.module.css'

interface AdminPasswordModalProps {
  onSuccess: () => void
}

const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025'

export default function AdminPasswordModal({ onSuccess }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('adminAuth') === 'true') {
      onSuccess()
    }
  }, [onSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true')
      onSuccess()
    } else {
      setError('Invalid password')
      setPassword('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent)
    }
    if (e.key === 'Escape') {
      // Allow escape to potentially close modal
      e.preventDefault()
    }
  }

  if (!mounted) return null

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={styles.modal} role="dialog" aria-labelledby="admin-modal-title">
        <h2 className={styles.title} id="admin-modal-title">Swift Scholars Admin</h2>
        <p className={styles.subtitle}>Maths Olympiad Control Panel</p>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error} role="alert" aria-live="polite">
              {error}
            </div>
          )}
          <input
            type="password"
            className={styles.input}
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            onKeyDown={handleKeyDown}
            aria-label="Admin password"
            aria-invalid={!!error}
            aria-describedby={error ? 'password-error' : undefined}
            autoFocus
          />
          {error && <div id="password-error" className={styles.srOnly}>{error}</div>}
          <button type="submit" className={styles.button} aria-label="Unlock admin panel">
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
