'use client'

import { Contestant } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import styles from './ContestantCard.module.css'

interface ContestantCardProps {
  contestant: Contestant
  sectionRank: number
  onWatchClick: (contestant: Contestant) => void
  shouldFlash: boolean
}

export default function ContestantCard({
  contestant,
  sectionRank,
  onWatchClick,
  shouldFlash,
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
      {contestant.picture_url && (
        <div className={styles.pictureContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={contestant.picture_url} alt={contestant.name} className={styles.picture} />
        </div>
      )}
      <div className={getPositionBadgeClass()}>{getMedalEmoji(sectionRank)}</div>
      <h3 className={styles.name}>{contestant.name}</h3>
      <div className={styles.scoreContainer}>
        <p className={styles.score}>{displayScore}</p>
        <p className={styles.label}>PTS</p>
      </div>
      {contestant.youtube_url && (
        <button
          className={styles.watchButton}
          onClick={() => onWatchClick(contestant)}
        >
          ▶ Watch Intro
        </button>
      )}
    </div>
  )
}
