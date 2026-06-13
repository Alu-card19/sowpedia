/**
 * Reusable Button component with accessibility support
 */

import { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  children: ReactNode
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classNames}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <span className={styles.content}>
        {icon && iconPosition === 'left' && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </span>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
    </button>
  )
}
