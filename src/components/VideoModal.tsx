'use client'

import { Contestant } from '@/lib/types'
import { useEffect, useRef } from 'react'
import styles from './VideoModal.module.css'

interface VideoModalProps {
  contestant: Contestant | null
  onClose: () => void
}

export default function VideoModal({ contestant, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Focus management - focus modal on open, restore focus on close
  useEffect(() => {
    if (!contestant?.youtube_url) return

    const previousActiveElement = document.activeElement as HTMLElement

    if (modalRef.current) {
      modalRef.current.focus()
    }

    return () => {
      // Restore focus when modal closes
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }, [contestant])

  if (!contestant || !contestant.youtube_url) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close on Escape key
    if (e.key === 'Escape') {
      e.preventDefault()
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
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="video-modal-title">
            {contestant.name} - Intro Video
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close video modal"
            title="Close (Esc)"
          >
            ×
          </button>
        </div>
        <div className={styles.videoContainer}>
          <iframe
            src={embedUrl}
            allowFullScreen
            allow="autoplay; fullscreen"
            title={`Intro video for ${contestant.name}`}
            aria-label={`Intro video for ${contestant.name}`}
          />
        </div>
      </div>
    </div>
  )
}
