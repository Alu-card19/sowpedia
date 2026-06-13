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

  // Convert YouTube URL to embed format
  const getEmbedUrl = (url: string): string => {
    // Handle youtube.com/watch?v=ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (watchMatch?.[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`
    }
    // If already in embed format, just add autoplay
    if (url.includes('/embed/')) {
      return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`
    }
    return url
  }

  const embedUrl = getEmbedUrl(contestant.youtube_url)

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
            src={embedUrl}
            allowFullScreen
            allow="autoplay; fullscreen"
            title={`Intro video for ${contestant.name}`}
          />
        </div>
      </div>
    </div>
  )
}
