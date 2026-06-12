'use client'

import styles from './AdminTabs.module.css'

interface AdminTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = ['Contestants', 'Sponsors', 'Live Board']

  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
