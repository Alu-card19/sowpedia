'use client'

import { Sponsor } from '@/lib/types'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import styles from './SponsorBar.module.css'

interface SponsorBarProps {
  sponsors: Sponsor[]
}

export default function SponsorBar({ sponsors }: SponsorBarProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentSponsorIndex, setCurrentSponsorIndex] = useState(0)
  const hasSponsors = sponsors && sponsors.length > 0

  // Sort sponsors by order_index
  const sortedSponsors = hasSponsors ? [...sponsors].sort((a, b) => a.order_index - b.order_index) : []

  // Sponsor carousel in fullscreen mode
  useEffect(() => {
    if (!isFullscreen || sortedSponsors.length === 0) return

    const interval = setInterval(() => {
      setCurrentSponsorIndex((prev) => (prev + 1) % sortedSponsors.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isFullscreen, sortedSponsors.length])

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  if (!hasSponsors) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>🤝 Proudly Supported By</h2>
          <div className={styles.placeholderMessage}>
            Sponsor logos coming soon
          </div>
        </div>
      </div>
    )
  }

  // If 4 or fewer sponsors, use grid; otherwise use marquee
  const useMarquee = sortedSponsors.length > 4

  return (
    <>
      {useMarquee ? (
        // Marquee mode
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.sponsorHeader}>
              <h2 className={styles.title}>🤝 Proudly Supported By</h2>
              {sortedSponsors.length > 0 && (
                <button
                  className={styles.fullscreenButton}
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Enter fullscreen sponsor mode"
                >
                  📺 Fullscreen Sponsors
                </button>
              )}
            </div>
            <div className={styles.marqueeContainer}>
              <div className={styles.marquee}>
                {[...sortedSponsors, ...sortedSponsors].map((sponsor, idx) => (
                  <div key={`${sponsor.id}-${idx}`} className={styles.logoCard}>
                    {sponsor.logo_url && (
                      <Image
                        src={sponsor.logo_url}
                        alt={sponsor.name}
                        title={sponsor.name}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 768px) 80px, 120px"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Grid mode
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.sponsorHeader}>
              <h2 className={styles.title}>🤝 Proudly Supported By</h2>
              {sortedSponsors.length > 0 && (
                <button
                  className={styles.fullscreenButton}
                  onClick={() => setIsFullscreen(true)}
                  aria-label="Enter fullscreen sponsor mode"
                >
                  📺 Fullscreen Sponsors
                </button>
              )}
            </div>
            <div className={styles.gridContainer}>
              {sortedSponsors.map((sponsor) => (
                <div key={sponsor.id} className={styles.logoCard}>
                  {sponsor.logo_url && (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      title={sponsor.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 100px, 150px"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Sponsor Modal */}
      {isFullscreen && sortedSponsors.length > 0 && (
        <div className={styles.fullscreenOverlay}>
          <div className={styles.fullscreenContent}>
            {/* Header */}
            <div className={styles.fullscreenHeader}>
              <div className={styles.headerSchoolLogo}>
                <Image
                  src="/logo.jpeg"
                  alt="SOW Logo"
                  width={50}
                  height={50}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h3 className={styles.thankYou}>Thank you to our sponsors</h3>
              <button
                className={styles.exitButton}
                onClick={() => setIsFullscreen(false)}
                aria-label="Exit fullscreen mode"
              >
                ✕
              </button>
            </div>

            {/* Sponsor Display */}
            <div className={styles.sponsorDisplayContainer}>
              {sortedSponsors.map((sponsor, idx) => (
                <div
                  key={sponsor.id}
                  className={`${styles.sponsorDisplay} ${
                    idx === currentSponsorIndex ? styles.activeSponsor : ''
                  }`}
                >
                  {sponsor.logo_url && (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      width={400}
                      height={300}
                      style={{ objectFit: 'contain', maxWidth: '400px', maxHeight: '300px' }}
                    />
                  )}
                  <p className={styles.sponsorName}>{sponsor.name}</p>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  animation: `progressFill 5s linear infinite`,
                }}
              />
            </div>

            {/* Dot Indicators */}
            <div className={styles.dotsContainer}>
              {sortedSponsors.map((_, idx) => (
                <button
                  key={idx}
                  className={`${styles.dot} ${idx === currentSponsorIndex ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSponsorIndex(idx)}
                  aria-label={`Go to sponsor ${idx + 1}`}
                  aria-pressed={idx === currentSponsorIndex}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
