'use client'

import { Contestant } from '@/lib/types'
import styles from './LiveLeaderboard.module.css'

interface LiveLeaderboardProps {
  contestants: Contestant[]
  activeSection: string | null
}

const SECTION_COLORS: Record<string, string> = {
  'Number Sprouts': '#2ecc71',
  'Counting Champions': '#e67e22',
  'Math Explorers': '#1abc9c',
  'Number Navigators': '#3498db',
  'Equation Builders': '#9b59b6',
  'Logic Leaders': '#27ae60',
  'Problem Solvers': '#e74c3c',
  'Math Mavericks': '#2980b9',
  'Junior Analysts': '#8e44ad',
  'Algebra Masters': '#16a085',
  'Olympiad Challengers': '#d35400',
  'Elite Mathematicians': '#1a5276',
  'Math Titans': '#6c3483',
  'Grand Olympians': '#922b21',
}

const ALL_SECTIONS = [
  'Number Sprouts',
  'Counting Champions',
  'Math Explorers',
  'Number Navigators',
  'Equation Builders',
  'Logic Leaders',
  'Problem Solvers',
  'Math Mavericks',
  'Junior Analysts',
  'Algebra Masters',
  'Olympiad Challengers',
  'Elite Mathematicians',
  'Math Titans',
  'Grand Olympians',
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

  const getRowBorderColor = (rank: number) => {
    if (rank === 1) return '#FFD700'
    if (rank === 2) return '#C0C0C0'
    if (rank === 3) return '#CD7F32'
    return 'transparent'
  }

  return (
    <div className={styles.container}>
      <div className={styles.leaderboardGrid}>
        {/* Section Leaderboard */}
        <div className={styles.leaderboardSection}>
          <h2 className={styles.leaderboardTitle}>🏆 Live Rankings — {activeSection}</h2>
          <p className={styles.subheading}>Swift Scholars Maths Olympiad</p>
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
                  <tr 
                    key={contestant.id} 
                    className={getRowClass(idx + 1)}
                    style={{ borderLeftColor: getRowBorderColor(idx + 1) }}
                  >
                    <td className={styles.rankCell}>{idx + 1}</td>
                    <td className={styles.nameCell}>{contestant.name} · {contestant.section}</td>
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
