'use client'

import { Contestant } from '@/lib/types'
import styles from './LiveLeaderboard.module.css'

interface LiveLeaderboardProps {
  contestants: Contestant[]
  activeSection: string | null
}

const SECTION_COLORS: Record<string, string> = {
  'Little Sprouts': '#FFD700',
  'Rising Explorers': '#00e5ff',
  'Builders League': '#00e676',
  'Champions Circle': '#C8102E',
  'Elite Masters': '#00e5ff',
  'Grand Legends': '#FFD700',
}

export default function LiveLeaderboard({
  contestants,
  activeSection,
}: LiveLeaderboardProps) {
  // Section leaderboard: top 10 for active section
  const sectionContestants = contestants
    .filter((c) => c.section === activeSection)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  // Overall leaderboard: top 10 across all sections
  const overallContestants = contestants
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  const getRowClass = (rank: number) => {
    if (rank === 1) return styles.row1
    if (rank === 2) return styles.row2
    if (rank === 3) return styles.row3
    return ''
  }

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardGrid}>
        {/* Section Leaderboard */}
        <div className={styles.leaderboardSection}>
          <h2 className={styles.leaderboardTitle}>{activeSection} Leaderboard</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {sectionContestants.map((contestant, idx) => (
                  <tr key={contestant.id} className={getRowClass(idx + 1)}>
                    <td className={styles.rankCell}>{idx + 1}</td>
                    <td className={styles.nameCell}>{contestant.name}</td>
                    <td className={styles.scoreCell}>{contestant.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overall Leaderboard */}
        <div className={styles.leaderboardSection}>
          <h2 className={styles.leaderboardTitle}>Overall Leaderboard</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Section</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {overallContestants.map((contestant, idx) => (
                  <tr key={contestant.id} className={getRowClass(idx + 1)}>
                    <td className={styles.rankCell}>{idx + 1}</td>
                    <td className={styles.nameCell}>{contestant.name}</td>
                    <td>
                      <span className={styles.sectionBadge}
                        style={{
                          backgroundColor: SECTION_COLORS[contestant.section] || '#FFD700',
                        }}
                      />
                      {contestant.section}
                    </td>
                    <td className={styles.scoreCell}>{contestant.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
