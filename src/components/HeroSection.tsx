'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroSection.module.css';
import {
  SCHOOL_NAME,
  SCHOOL_TAGLINE,
  COMPETITION_SUBTITLE,
  COMPETITION_FOOTER,
  MATH_BG_SYMBOLS,
} from '@/lib/constants';

const HERO_IMAGES = [
  '/hero/1.jpeg',
  '/hero/2.jpeg',
  '/hero/3.jpeg',
  '/hero/4.jpeg',
  '/hero/5.jpeg',
  '/hero/6.jpeg',
  '/hero/7.jpeg',
  '/hero/8.jpeg',
  '/hero/9.jpeg',
  '/hero/10.jpeg',
  '/hero/11.jpeg',
  '/hero/12.jpeg',
  '/hero/13.jpeg',
  '/hero/14.jpeg',
  '/hero/15.jpeg',
  '/hero/16.jpeg',
  '/hero/17.jpeg',
  '/hero/18.jpeg',
  '/hero/19.jpeg',
  '/hero/20.jpeg',
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      {/* Background Image Carousel */}
      <div className={styles.backgroundCarousel}>
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image}
            className={`${styles.backgroundImage} ${
              index === currentImageIndex ? styles.active : ''
            }`}
          >
            <Image
              src={image}
              alt={`Hero background ${index + 1}`}
              fill
              className={styles.carouselImage}
              priority={index === 0}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className={styles.overlay} />
      {/* Floating math symbols background */}
      <div className={styles.mathBg} aria-hidden="true">
        {MATH_BG_SYMBOLS.map((sym, i) => (
          <span
            key={i}
            className={styles.mathSymbol}
            style={{
              top: `${10 + ((i * 17) % 80)}%`,
              left: `${5 + ((i * 23) % 90)}%`,
              fontSize: `${0.8 + ((i % 3) * 0.5)}rem`,
              opacity: 0.05 + ((i % 3) * 0.025),
              transform: `rotate(${(i % 5) * 12 - 24}deg)`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      <div className={styles.heroInner}>
        {/* School identity */}
        <div className={styles.schoolBadge}>
          <div className={styles.crest}>
            <Image
              src="/logo.jpeg"
              alt="SOW Logo"
              width={42}
              height={42}
              className={styles.crestImage}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.schoolText}>
            <p className={styles.schoolName}>{SCHOOL_NAME}</p>
            <p className={styles.schoolTagline}>— {SCHOOL_TAGLINE} —</p>
          </div>
        </div>

        {/* Main title */}
        <div className={styles.titleBlock}>
          <p className={styles.theLabel}>THE</p>
          <h1 className={styles.mainTitle}>
            <span className={styles.titleLine}>SWIFT SCHOLARS</span>
            <span className={styles.titleLineMaths}>MATHS</span>
            <span className={styles.titleLineOlympiad}>OLYMPIAD</span>
          </h1>
        </div>

        {/* Tagline banner */}
        <div className={styles.taglineBanner}>
          <span className={styles.star}>★</span>
          <p className={styles.tagline}>{COMPETITION_SUBTITLE}</p>
          <span className={styles.star}>★</span>
        </div>

        {/* Decorative math row */}
        <div className={styles.mathRow}>
          {['÷', '+', '×', '=', '%', '√'].map((s, i) => (
            <span key={i} className={styles.mathDeco}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* CTA footer bar */}
      <div className={styles.heroCta}>
        <span>➤</span>
        <p>{COMPETITION_FOOTER}</p>
        <span>◄</span>
      </div>
    </section>
  );
}
