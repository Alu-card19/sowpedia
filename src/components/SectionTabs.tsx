'use client';

import React from 'react';
import styles from './SectionTabs.module.css';
import { Section } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface Props {
  sections: Section[];
  activeSection: string | null;
  onSectionChange: (name: string) => void;
}

export default function SectionTabs({
  sections,
  activeSection,
  onSectionChange,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsScroll}>
        {sections.map((section) => {
          const config = CATEGORY_CONFIG[section.name] ?? {
            classLabel: section.class_label ?? '',
            color: '#FFD700',
            icon: '📐',
            mathSymbol: '∑',
          };
          const isActive = section.name === activeSection;

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.name)}
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              style={
                {
                  '--tab-color': config.color,
                  borderBottomColor: isActive
                    ? config.color
                    : 'transparent',
                  color: isActive
                    ? config.color
                    : 'rgba(255,248,231,0.6)',
                } as React.CSSProperties
              }
            >
              <span className={styles.tabIcon}>{config.icon}</span>
              <span className={styles.tabCategory}>{section.name}</span>
              <span className={styles.tabClass}>{config.classLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
