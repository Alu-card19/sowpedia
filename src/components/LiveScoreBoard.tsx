'use client'

import { useEffect, useState } from 'react'
import { Contestant, Section } from '@/lib/types'
import { apiPost } from '@/lib/clientApi'
import styles from './LiveScoreBoard.module.css'

interface LiveScoreBoardProps {
  contestants: Contestant[]
  sections: Section[]
  activeSection: string | null
  onSectionChange: (section: string) => void
}

export default function LiveScoreBoard({
  contestants: initialContestants,
  sections,
  activeSection,
  onSectionChange,
}: LiveScoreBoardProps) {
  const [contestants, setContestants] = useState(initialContestants)
  const [pointsPerAnswer, setPointsPerAnswer] = useState(10)
  const [directScores, setDirectScores] = useState<Record<string, string>>({})

  // Sync with parent when prop changes
  useEffect(() => {
    setContestants(initialContestants)
  }, [initialContestants])

  const sectionContestants = contestants
    .filter((c) => c.section === activeSection)
    .sort((a, b) => b.score - a.score)

  const handleScoreUpdate = async (id: string, newScore: number) => {
    // Immediately update local state for instant UI feedback
    setContestants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, score: newScore } : c))
    )

    try {
      await apiPost('/api/scores', { id, score: newScore })
    } catch (error) {
      console.error('Error updating score:', error)
      // Revert on error
      setContestants((prev) =>
        prev.map((c) => (c.id === id ? { ...c, score: c.score } : c))
      )
      alert(`Failed to update score: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleIncrement = (id: string, currentScore: number) => {
    handleScoreUpdate(id, currentScore + pointsPerAnswer)
  }

  const handleDecrement = (id: string, currentScore: number) => {
    handleScoreUpdate(id, Math.max(0, currentScore - pointsPerAnswer))
  }

  const handleDirectScore = (id: string) => {
    const newScore = parseInt(directScores[id] || '0')
    if (!isNaN(newScore)) {
      handleScoreUpdate(id, newScore)
      setDirectScores((prev) => {
        const next = { ...prev }
        delete next[id]
        return next
      })
    }
  }

  const handleResetSection = () => {
    if (prompt('Type RESET to confirm:') === 'RESET') {
      sectionContestants.forEach((c) => {
        handleScoreUpdate(c.id, 0)
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.controls}>
          <select
            className={styles.select}
            value={activeSection || ''}
            onChange={(e) => onSectionChange(e.target.value)}
          >
            {sections.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            className={styles.input}
            value={pointsPerAnswer}
            onChange={(e) => setPointsPerAnswer(parseInt(e.target.value) || 0)}
            placeholder="Points per answer"
            min="1"
          />
          <button className={`${styles.button} ${styles.buttonDanger}`} onClick={handleResetSection}>
            Reset All
          </button>
        </div>

        <div className={styles.cardsGrid}>
          {sectionContestants.map((contestant) => (
            <div key={contestant.id} className={styles.card}>
              <h4 className={styles.cardName}>{contestant.name}</h4>
              <div className={styles.scoreRow}>
                <div className={styles.score}>{contestant.score}</div>
                <div className={styles.scoreButtons}>
                  <button
                    className={styles.scoreBtn}
                    onClick={() => handleDecrement(contestant.id, contestant.score)}
                  >
                    −
                  </button>
                  <button
                    className={styles.scoreBtn}
                    onClick={() => handleIncrement(contestant.id, contestant.score)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.directInput}>
                <input
                  type="number"
                  className={styles.scoreInput}
                  value={directScores[contestant.id] || ''}
                  onChange={(e) =>
                    setDirectScores((prev) => ({
                      ...prev,
                      [contestant.id]: e.target.value,
                    }))
                  }
                  placeholder="Direct input"
                />
                <button
                  className={styles.saveBtn}
                  onClick={() => handleDirectScore(contestant.id)}
                >
                  Set
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Current Ranking</h3>
        {sectionContestants.map((c, idx) => (
          <div key={c.id} className={styles.rankingItem}>
            <div>
              <span className={styles.rankingRank}>{idx + 1}.</span> {c.name}
            </div>
            <span className={styles.rankingScore}>{c.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
