'use client'

import { Contestant } from '@/lib/types'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import styles from './ContestantCard.module.css'

interface ContestantCardProps {
  contestant: Contestant
  sectionRank: number
  onWatchClick: (contestant: Contestant) => void
  shouldFlash: boolean
  categoryColor?: string
}

export default function ContestantCard({
  contestant,
  sectionRank,
  onWatchClick,
  shouldFlash,
  categoryColor,
}: ContestantCardProps) {
  const [displayScore, setDisplayScore] = useState(contestant.score)
  const [isFlashing, setIsFlashing] = useState(false)
  const previousScoreRef = useRef(contestant.score)

  // Animate score changes
  useEffect(() => {
    if (contestant.score !== previousScoreRef.current) {
      const startScore = previousScoreRef.current
      const endScore = contestant.score
      const duration = 1000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentScore = Math.floor(startScore + (endScore - startScore) * progress)
        setDisplayScore(currentScore)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
      previousScoreRef.current = endScore
    }
  }, [contestant.score])

  // Flash animation
  useEffect(() => {
    if (shouldFlash) {
      setIsFlashing(true)
      const timer = setTimeout(() => setIsFlashing(false), 600)
      return () => clearTimeout(timer)
    }
  }, [shouldFlash])

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank.toString()
  }

  const MATH_WATERMARKS = ['Ω', 'Σ', '√', 'π', '∫', 'Δ', 'θ', '∞']
  const watermark = MATH_WATERMARKS[contestant.position % MATH_WATERMARKS.length]

  const getBorderClass = () => {
    if (sectionRank === 1) return styles.gold
    if (sectionRank === 2) return styles.silver
    if (sectionRank === 3) return styles.bronze
    return ''
  }

  const getPositionBadgeClass = () => {
    if (sectionRank === 1) return styles.gold
    if (sectionRank === 2) return `${styles.positionBadge} ${styles.silver}`
    if (sectionRank === 3) return `${styles.positionBadge} ${styles.bronze}`
    return styles.positionBadge
  }

  return (
    <div className={`${styles.card} ${getBorderClass()} ${isFlashing ? styles.flash : ''}`}>
      <div
        className={styles.accentBar}
        style={{ background: categoryColor ?? '#FFD700' }}
      />
      {contestant.picture_url && (
        <div className={styles.pictureContainer}>
          <Image
            src={contestant.picture_url}
            alt={contestant.name}
            fill
            className={styles.picture}
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 150px, 200px"
            priority={sectionRank <= 3}
          />
        </div>
      )}
      <span className={styles.watermark}>{watermark}</span>
      <div className={getPositionBadgeClass()}>{getMedalEmoji(sectionRank)}</div>
      <h3 className={styles.name}>{contestant.name}</h3>
      <div className={styles.scoreContainer}>
        <span className={styles.scoreLabel}>Score</span>
        <p className={styles.score}>{displayScore}</p>
        <p className={styles.label}>PTS</p>
      </div>
      {contestant.youtube_url && (
        <button
          className={styles.watchButton}
          onClick={() => onWatchClick(contestant)}
          aria-label={`Watch intro video for ${contestant.name}`}
          title={`Watch intro video for ${contestant.name}`}
        >
          ▶ Watch Intro
        </button>
      )}
    </div>
  )
}
