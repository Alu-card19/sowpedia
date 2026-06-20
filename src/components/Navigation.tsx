'use client'

import Link from 'next/link'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          SOW Spelling Bee
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/spelling-round" className={styles.link}>
            🎤 Spelling Round
          </Link>
          <Link href="/admin" className={styles.link}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
