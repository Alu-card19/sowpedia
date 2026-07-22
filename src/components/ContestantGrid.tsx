'use client'

import { Contestant } from '@/lib/types'
import ContestantCard from './ContestantCard'
import styles from './ContestantGrid.module.css'
import { CATEGORY_CONFIG } from '@/lib/constants'

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

  // activeSection is already the section name, use it directly
  const sectionName = activeSection ?? ''
  const config = CATEGORY_CONFIG[sectionName] ?? {
    classLabel: '',
    color: '#FFD700',
    icon: '📐',
    mathSymbol: '∑',
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {sectionName && (
          <div className={styles.sectionHeading}>
            <h2 className={styles.sectionTitle}>{sectionName}</h2>
            {config && (
              <p
                className={styles.sectionMeta}
                style={{ color: config.color }}
              >
                {config.classLabel} · {config.icon}
              </p>
            )}
          </div>
        )}
        <div className={styles.grid}>
          {sectionContestants.map((contestant, idx) => (
            <ContestantCard
              key={contestant.id}
              contestant={contestant}
              sectionRank={idx + 1}
              onWatchClick={onWatchClick}
              shouldFlash={updatedContestantId === contestant.id}
              categoryColor={config?.color ?? '#FFD700'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
