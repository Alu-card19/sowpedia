/**
 * Loading skeleton placeholder component
 */

import styles from './LoadingSkeleton.module.css'

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'rect'
  width?: string
  height?: string
  count?: number
  className?: string
}

export default function LoadingSkeleton({
  variant = 'rect',
  width = '100%',
  height = '20px',
  count = 1,
  className = '',
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{ width, height }}
      aria-busy="true"
      aria-label="Loading..."
    />
  ))

  return count === 1 ? items[0] : <div className={styles.container}>{items}</div>
}

export function CardSkeleton() {
  return (
    <div className={styles.card}>
      <LoadingSkeleton variant="rect" height="180px" className={styles.image} />
      <div className={styles.cardContent}>
        <LoadingSkeleton variant="text" height="18px" />
        <LoadingSkeleton variant="text" height="14px" className={styles.mt2} />
        <LoadingSkeleton variant="rect" height="36px" className={styles.mt3} />
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
