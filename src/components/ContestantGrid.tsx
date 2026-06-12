'use client'

import { Contestant } from '@/lib/types'
import ContestantCard from './ContestantCard'
import styles from './ContestantGrid.module.css'

interface ContestantGridProps {
  contestants: Contestant[]
  activeSection: string | null
  onWatchClick: (contestant: Contestant) => void
  updatedContestantId: string | null
}

export default function ContestantGrid({
  contestants,
  activeSection,
  onWatchClick,
  updatedContestantId,
}: ContestantGridProps) {
  const sectionContestants = contestants
    .filter((c) => c.section === activeSection)
    .sort((a, b) => b.score - a.score)

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.grid}>
          {sectionContestants.map((contestant, idx) => (
            <ContestantCard
              key={contestant.id}
              contestant={contestant}
              sectionRank={idx + 1}
              onWatchClick={onWatchClick}
              shouldFlash={updatedContestantId === contestant.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
