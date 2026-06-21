'use client'

import styles from './AdminTabs.module.css'
import { useRef } from 'react'

interface AdminTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = ['Contestants', 'Sponsors', 'Spelling Words', 'Live Board']
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabClick = (tab: string) => {
    onTabChange(tab)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index

    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      newIndex = index === 0 ? tabs.length - 1 : index - 1
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      newIndex = index === tabs.length - 1 ? 0 : index + 1
    } else if (e.key === 'Home') {
      e.preventDefault()
      newIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      newIndex = tabs.length - 1
    } else {
      return
    }

    tabRefs.current[newIndex]?.focus()
    onTabChange(tabs[newIndex])
  }

  return (
    <div className={styles.tabsContainer} role="tablist">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          ref={(el) => {
            tabRefs.current[index] = el
          }}
          className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
          onClick={() => handleTabClick(tab)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          role="tab"
          aria-selected={activeTab === tab}
          aria-label={`${tab} tab`}
          tabIndex={activeTab === tab ? 0 : -1}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
