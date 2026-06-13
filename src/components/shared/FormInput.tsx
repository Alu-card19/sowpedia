/**
 * Reusable Form Input component with validation
 */

import { InputHTMLAttributes, useState } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  required?: boolean
}

export default function FormInput({
  label,
  error,
  helperText,
  icon,
  required,
  disabled = false,
  className = '',
  id,
  ...props
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="required">*</span>}
        </label>
      )}

      <div className={`${styles.inputContainer} ${isFocused ? styles.focused : ''} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${className}`}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </div>

      {error && (
        <div id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </div>
      )}

      {helperText && !error && (
        <div id={`${inputId}-helper`} className={styles.helperText}>
          {helperText}
        </div>
      )}
    </div>
  )
}
