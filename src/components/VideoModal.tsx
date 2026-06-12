'use client'

import { Contestant } from '@/lib/types'
import styles from './VideoModal.module.css'

interface VideoModalProps {
  contestant: Contestant | null
  onClose: () => void
}

export default function VideoModal({ contestant, onClose }: VideoModalProps) {
  if (!contestant || !contestant.youtube_url) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{contestant.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.videoContainer}>
          <iframe
            src={`${contestant.youtube_url}?autoplay=1`}
            allowFullScreen
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  )
}
