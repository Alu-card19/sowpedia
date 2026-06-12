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

  if (!mounted) return null

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Admin Panel</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <input
            type="password"
            className={styles.input}
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            autoFocus
          />
          <button type="submit" className={styles.button}>
            Unlock
          </button>
        </form>
      </div>
    </div>
  )
}
