'use client'

import Link from 'next/link'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          Swift Scholars Maths Olympiad
        </Link>
        <div className={styles.links}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/spelling-round" className={styles.link}>
            📐 Practice Round
          </Link>
          <Link href="/admin" className={styles.link}>
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
