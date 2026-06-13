'use client'

import { Sponsor } from '@/lib/types'
import Image from 'next/image'
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
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      title={sponsor.name}
                      fill
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 768px) 80px, 120px"
                    />
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
                <Image
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  title={sponsor.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100px, 150px"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
