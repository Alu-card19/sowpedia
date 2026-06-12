'use client'

import { Sponsor } from '@/lib/types'
import styles from './SponsorBar.module.css'

interface SponsorBarProps {
  sponsors: Sponsor[]
}

export default function SponsorBar({ sponsors }: SponsorBarProps) {
  if (!sponsors || sponsors.length === 0) return null

  // Sort by order_index
  const sortedSponsors = [...sponsors].sort((a, b) => a.order_index - b.order_index)

  // If 4 or fewer sponsors, use grid; otherwise use marquee
  const useMarquee = sortedSponsors.length > 4

  if (useMarquee) {
    // Duplicate sponsors for seamless loop
    const duplicatedSponsors = [...sortedSponsors, ...sortedSponsors]

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Our Sponsors</h2>
          <div className={styles.marqueeContainer}>
            <div className={styles.marquee}>
              {duplicatedSponsors.map((sponsor, idx) => (
                <div key={`${sponsor.id}-${idx}`} className={styles.logoCard}>
                  {sponsor.logo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={sponsor.logo_url} alt={sponsor.name} title={sponsor.name} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Our Sponsors</h2>
        <div className={styles.gridContainer}>
          {sortedSponsors.map((sponsor) => (
            <div key={sponsor.id} className={styles.logoCard}>
              {sponsor.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sponsor.logo_url} alt={sponsor.name} title={sponsor.name} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
