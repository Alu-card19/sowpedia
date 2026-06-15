'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './HeroSection.module.css'

// Add your student images to /public/hero/ folder
// Name them 1.jpeg, 2.jpeg, 3.jpeg etc.
// Recommended size: 1920x1080px, landscape orientation
// The overlay ensures text is always readable regardless of image brightness
const heroImages = [
  '/hero/1.jpeg',
  '/hero/2.jpeg',
  '/hero/3.jpeg',
  '/hero/4.jpeg',
  '/hero/5.jpeg',
  '/hero/6.jpeg',
  '/hero/7.jpeg',
  '/hero/8.jpeg',
  '/hero/9.jpeg',
  '/hero/10.jpeg',
  '/hero/11.jpeg',
  '/hero/12.jpeg',
  '/hero/13.jpeg',
  '/hero/14.jpeg',
  '/hero/15.jpeg',
  '/hero/16.jpeg',
  '/hero/17.jpeg',
  '/hero/18.jpeg',
  '/hero/19.jpeg',
  '/hero/20.jpeg',
]

export default function HeroSection() {
  const [isLive, setIsLive] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const currentYear = new Date().getFullYear()

  // Preload images on mount
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new window.Image()
      img.onerror = () => {
        // Skip failed images silently
        console.warn(`Failed to load hero image: ${src}`)
      }
      img.src = src
    })
  }, [])

  // Slideshow rotation with sparkle reset
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true)
      // Trigger sparkle reset by briefly removing and re-adding the animation
      const overlay = document.querySelector('[data-sparkle-overlay]') as HTMLElement | null
      if (overlay) {
        overlay.style.animation = 'none'
        setTimeout(() => {
          overlay.style.animation = ''
        }, 10)
      }
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        setFadeOut(false)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

  useEffect(() => {
    checkLiveStatus()
    const interval = setInterval(checkLiveStatus, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index: number) => {
    setFadeOut(true)
    setTimeout(() => {
      setCurrentImageIndex(index)
      setFadeOut(false)
    }, 500)
  }

  return (
    <section className={styles.hero}>
      {/* Slideshow Background */}
      <div className={styles.slideshowContainer}>
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentImageIndex ? styles.activeSlide : ''
            } ${fadeOut && index === currentImageIndex ? styles.fadeOut : ''}`}
            style={{
              backgroundImage: `url('${src}')`,
            }}
          />
        ))}
        {/* Dark Overlay */}
        <div className={styles.overlay} data-sparkle-overlay />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo.jpeg"
            alt="SOW Logo"
            width={200}
            height={200}
            className={styles.logo}
            priority
          />
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
      </div>

      {/* Dot Indicators */}
      <div className={styles.dotsContainer}>
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={index === currentImageIndex}
          />
        ))}
      </div>
    </section>
  )
}
