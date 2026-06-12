'use client'

import { Section } from '@/lib/types'
import styles from './SectionTabs.module.css'

interface SectionTabsProps {
  sections: Section[]
  activeSection: string | null
  onSectionChange: (sectionName: string) => void
}

export default function SectionTabs({ sections, activeSection, onSectionChange }: SectionTabsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {sections.map((section) => (
          <button
            key={section.id}
            className={`${styles.tab} ${activeSection === section.name ? styles.tabActive : ''}`}
            onClick={() => onSectionChange(section.name)}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  )
}
