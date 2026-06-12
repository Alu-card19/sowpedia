'use client'

import { useEffect, useState } from 'react'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  const [isLive, setIsLive] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    // Check if there was a score update in the last 5 minutes
    const checkLiveStatus = () => {
      const lastUpdate = localStorage.getItem('lastScoreUpdate')
      if (lastUpdate) {
        const lastUpdateTime = parseInt(lastUpdate)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
        setIsLive(lastUpdateTime > fiveMinutesAgo)
      } else {
        setIsLive(false)
      }
    }

    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.logoContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.jpeg" alt="SOW Logo" className={styles.logo} />
      </div>
      <h1 className={styles.heading}>SEAT OF WISDOM GROUP OF SCHOOLS</h1>
      <p className={styles.subheading}>Spelling Bee Championship</p>
      <p className={styles.year}>{currentYear}</p>
      <div className={styles.decorativeLine} />
      {isLive && (
        <div className={styles.liveBadge}>
          <span className={styles.liveDot} />
          LIVE
        </div>
      )}
    </section>
  )
}
