'use client'

import { Contestant } from '@/lib/types'
import styles from './LiveLeaderboard.module.css'

interface LiveLeaderboardProps {
  contestants: Contestant[]
  activeSection: string | null
}

const SECTION_COLORS: Record<string, string> = {
  'Little Sprouts': '#00e676',
  'Rising Explorers': '#00bcd4',
  'Builders League': '#2196f3',
  'Champions Circle': '#9c27b0',
  'Elite Masters': '#ff9800',
  'Grand Legends': '#FFD700',
}

const ALL_SECTIONS = [
  'Little Sprouts',
  'Rising Explorers',
  'Builders League',
  'Champions Circle',
  'Elite Masters',
  'Grand Legends',
]

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

  // Section totals leaderboard
  const sectionTotals = ALL_SECTIONS.map((section) => ({
    name: section,
    total: contestants
      .filter((c) => c.section === section)
      .reduce((sum, c) => sum + c.score, 0),
    count: contestants.filter((c) => c.section === section).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.total - a.total)

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

        {/* Section Totals Leaderboard */}
        <div className={styles.leaderboardSection}>
          <div>
            <h2 className={styles.leaderboardTitle}>🏫 Section Rankings</h2>
            <p className={styles.subheading}>Total points accumulated per section</p>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Section</th>
                  <th>Contestants</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sectionTotals.map((section, idx) => (
                  <tr key={section.name} className={getRowClass(idx + 1)}>
                    <td className={styles.rankCell}>{idx + 1}</td>
                    <td>
                      <span className={styles.sectionBadge}
                        style={{
                          backgroundColor: SECTION_COLORS[section.name] || '#FFD700',
                        }}
                      />
                      {section.name}
                    </td>
                    <td className={styles.contestantCountCell}>{section.count} contestants</td>
                    <td className={styles.totalScoreCell}>{section.total}</td>
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
