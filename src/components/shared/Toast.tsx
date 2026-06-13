/**
 * Global toast notification component
 */

import { useEffect } from 'react'
import styles from './Toast.module.css'
import { TOAST_DURATION } from '@/lib/constants'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
  id?: string
}

export default function Toast({
  message,
  type = 'info',
  duration = TOAST_DURATION,
  onClose,
  id,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      case 'info':
      default:
        return 'ℹ'
    }
  }

  return (
    <div
      className={`${styles.toast} ${styles[type]}`}
      role="alert"
      aria-live="polite"
      id={id}
    >
      <span className={styles.icon} aria-hidden="true">
        {getIcon()}
      </span>
      <span className={styles.message}>{message}</span>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}
