'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { SpellingWord, Sponsor } from '@/lib/types'
import { DIFFICULTY_LABELS } from '@/lib/constants'
import styles from './page.module.css'

const SECTIONS = [
  'Number Sprouts',
  'Counting Champions',
  'Math Explorers',
  'Number Navigators',
  'Equation Builders',
  'Logic Leaders',
  'Problem Solvers',
  'Math Mavericks',
  'Junior Analysts',
  'Algebra Masters',
  'Olympiad Challengers',
  'Elite Mathematicians',
  'Math Titans',
  'Grand Olympians',
]

const DIFFICULTIES = ['All', 'Foundation', 'Intermediate', 'Advanced', 'Olympiad']

type AnimationState = 'idle' | 'correct' | 'wrong'

/**
 * Fetch all spelling words with pagination to bypass 1000 row limit
 */
async function fetchAllSpellingWords() {
  const PAGE_SIZE = 1000
  let allWords: SpellingWord[] = []
  let from = 0
  let hasMore = true

  while (hasMore) {
    const query = supabase
      .from('spelling_words')
      .select('*')
      .order('id', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)

    const { data, error } = await query

    if (error || !data || data.length === 0) break

    allWords = [...allWords, ...data]
    from += PAGE_SIZE
    hasMore = data.length === PAGE_SIZE
  }

  return allWords
}

export default function SpellingRoundPage() {
  const router = useRouter()
  const [isHostView, setIsHostView] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedWord, setSelectedWord] = useState<SpellingWord | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [contestantName, setContestantName] = useState('')
  const [usedWordIds, setUsedWordIds] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0])
  const [activeDifficulty, setActiveDifficulty] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [words, setWords] = useState<SpellingWord[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [animationState, setAnimationState] = useState<AnimationState>('idle')
  const [contestantFlash, setContestantFlash] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout>()
  const confettiRef = useRef<HTMLDivElement>(null)

  // Check auth status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('adminAuth') === 'true'
      setIsAuthenticated(isAuth)
      if (!isAuth) {
        setIsHostView(false)
      }
    }
  }, [])

  // Fetch words and sponsors
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all words with pagination
        const wordsData = await fetchAllSpellingWords()
        setWords(wordsData || [])

        // Fetch sponsors
        const { data: sponsorsData, error: sponsorsError } = await supabase
          .from('sponsors')
          .select('*')
          .order('order_index')

        if (sponsorsError) throw sponsorsError
        setSponsors(sponsorsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Generate floating animations for sponsors (kept for reference)
  // Animations are generated dynamically in the useEffect below

  // Filter words based on section, difficulty, and search
  const filteredWords = words.filter((word) => {
    const matchSection = word.section === activeSection
    const matchDifficulty =
      activeDifficulty === 'All' ||
      DIFFICULTY_LABELS[word.difficulty || 'easy'] === activeDifficulty
    const matchSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSection && matchDifficulty && matchSearch
  })

  // Handle word selection
  const handleWordSelect = (word: SpellingWord) => {
    setSelectedWord(word)
    setRevealed(false)
  }

  // Handle reveal word
  const handleReveal = () => {
    setRevealed(true)
  }

  // Handle hear word (text to speech)
  const handleHearWord = () => {
    if (!selectedWord) return
    const utterance = new SpeechSynthesisUtterance(selectedWord.word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  // Create confetti
  const createConfetti = useCallback(() => {
    if (!confettiRef.current) return

    const colors = ['#FFD700', '#00e5ff', '#00e676', '#ffffff']
    const confettiCount = 60

    for (let i = 0; i < confettiCount; i++) {
      const piece = document.createElement('div')
      piece.className = styles.confetti
      piece.style.left = window.innerWidth / 2 + 'px'
      piece.style.top = window.innerHeight / 2 + 'px'
      piece.style.background = colors[Math.floor(Math.random() * colors.length)]
      piece.style.setProperty('--tx', `${(Math.random() - 0.5) * 400}px`)
      piece.style.setProperty('--ty', `${(Math.random() - 0.5) * 400}px`)

      confettiRef.current.appendChild(piece)

      setTimeout(() => piece.remove(), 2000)
    }
  }, [])

  // Create floating emojis
  const createEmojis = useCallback(() => {
    const emojis = ['🎉', '🎊', '🥳']
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2 + 100

    emojis.forEach((emoji, index) => {
      const emojiEl = document.createElement('div')
      emojiEl.className = styles.celebrationEmoji
      emojiEl.textContent = emoji
      emojiEl.style.left = centerX + 'px'
      emojiEl.style.top = centerY + 'px'
      emojiEl.style.animationDelay = `${index * 0.2}s`

      document.body.appendChild(emojiEl)

      setTimeout(() => emojiEl.remove(), 2000)
    })
  }, [])

  // Handle correct
  const handleCorrect = useCallback(() => {
    if (!selectedWord) return

    setAnimationState('correct')

    // Mark as used
    setUsedWordIds([...usedWordIds, selectedWord.id])

    // Pulse animation
    const stageCard = document.querySelector(`.${styles.stageCard}`)
    if (stageCard) {
      stageCard.classList.add(styles.pulseAnimation)
      setTimeout(() => stageCard.classList.remove(styles.pulseAnimation), 600)
    }

    // Flash contestant name
    if (contestantName) {
      setContestantFlash(true)
      setTimeout(() => setContestantFlash(false), 2000)
    }

    // Create celebrations
    createConfetti()
    createEmojis()

    // Clear after animation
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationState('idle')
      setSelectedWord(null)
      setRevealed(false)
    }, 3000)
  }, [selectedWord, usedWordIds, contestantName, createConfetti, createEmojis])

  // Handle wrong
  const handleWrong = useCallback(() => {
    if (!selectedWord) return

    setAnimationState('wrong')

    // Mark as used
    setUsedWordIds([...usedWordIds, selectedWord.id])

    // Shake animation
    const stageCard = document.querySelector(`.${styles.stageCard}`)
    if (stageCard) {
      stageCard.classList.add(styles.shakeAnimation)
      setTimeout(() => stageCard.classList.remove(styles.shakeAnimation), 500)
    }

    // Red flash
    const container = document.querySelector(`.${styles.container}`)
    if (container) {
      const flash = document.createElement('div')
      flash.style.position = 'fixed'
      flash.style.top = '0'
      flash.style.left = '0'
      flash.style.width = '100%'
      flash.style.height = '100%'
      flash.style.background = 'rgba(200, 16, 46, 0.3)'
      flash.style.pointerEvents = 'none'
      flash.style.animation = `redFlash 0.5s ease`
      flash.style.zIndex = '999'
      document.body.appendChild(flash)
      setTimeout(() => flash.remove(), 500)
    }

    // Flash word red
    const wordEl = document.querySelector(`.${styles.revealedWord}`) as HTMLElement | null
    if (wordEl) {
      wordEl.style.color = '#f44336'
      setTimeout(() => {
        wordEl.style.color = '#ffd700'
      }, 300)
    }

    // Clear after animation
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationState('idle')
    }, 1000)
  }, [selectedWord, usedWordIds])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isHostView) return

      if (selectedWord && !revealed && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        handleReveal()
      } else if (revealed && e.code === 'KeyC') {
        e.preventDefault()
        handleCorrect()
      } else if (revealed && e.code === 'KeyX') {
        e.preventDefault()
        handleWrong()
      } else if (e.code === 'Escape') {
        e.preventDefault()
        setSelectedWord(null)
        setRevealed(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedWord, revealed, isHostView, handleCorrect, handleWrong])

  // Create CSS for floating animations
  useEffect(() => {
    const style = document.createElement('style')
    sponsors.forEach((_, index) => {
      const floatAngle = Math.random() * 360
      const floatDistance = Math.max(window.innerWidth, window.innerHeight) * 1.5

      style.textContent += `
        @keyframes float-${index} {
          0% { transform: translate(${Math.random() * window.innerWidth}px, ${Math.random() * window.innerHeight}px); }
          100% { transform: translate(${Math.cos((floatAngle * Math.PI) / 180) * floatDistance}px, ${Math.sin((floatAngle * Math.PI) / 180) * floatDistance}px); }
        }
      `
    })
    document.head.appendChild(style)
    return () => style.remove()
  }, [sponsors])

  if (!isAuthenticated && isHostView) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>Access Denied</div>
          <p>You must be logged in as admin to access host view.</p>
          <button
            onClick={() => router.push('/admin')}
            style={{
              padding: '10px 20px',
              background: '#ffd700',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Login to Admin
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Floating Sponsors Background */}
      <div className={styles.sponsorsContainer}>
        {sponsors.map((sponsor, index) => {
          const size = 80 + Math.random() * 60 // 80px to 140px

          return (
            <div
              key={sponsor.id}
              className={styles.floatingLogo}
              style={{
                width: size,
                height: size,
                animation: `float-${index} ${20 + Math.random() * 25}s linear infinite`,
              } as React.CSSProperties}
            >
                <Image
                  src={sponsor.logo_url || '/logo.jpeg'}
                  alt={sponsor.name}
                  width={size}
                  height={size}
                  priority={false}
                />
            </div>
          )
        })}
      </div>

      {/* Dark Overlay */}
      <div className={styles.overlay} />

      {/* Confetti Container */}
      <div ref={confettiRef} style={{ pointerEvents: 'none' }} />

      {/* View Toggle Button */}
      {isAuthenticated && (
        <button
          className={styles.viewToggle}
          onClick={() => setIsHostView(!isHostView)}
        >
          {isHostView ? '👁 Audience View' : '🎛 Host View'}
        </button>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        {/* LEFT PANEL - Host Controls */}
        <div className={`${styles.leftPanel} ${!isHostView ? styles.hidden : ''}`}>
          {/* Section & Difficulty Selectors */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Category</label>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
              >
                {SECTIONS.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Difficulty</label>
            <div className={styles.selectContainer}>
              <select
                className={styles.select}
                value={activeDifficulty}
                onChange={(e) => setActiveDifficulty(e.target.value)}
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Search</label>
            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Question List */}
          <div className={styles.wordListContainer}>
            {filteredWords.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.4)',
                  padding: '20px',
                  fontSize: '12px',
                }}
              >
                No problems found
              </div>
            ) : (
              filteredWords.map((word) => (
                <div
                  key={word.id}
                  className={`${styles.wordRow} ${
                    selectedWord?.id === word.id ? styles.selected : ''
                  } ${usedWordIds.includes(word.id) ? styles.used : ''}`}
                  onClick={() => handleWordSelect(word)}
                >
                  <div
                    className={`${styles.difficultyBadge} ${
                      styles[`badge_${word.difficulty || 'easy'}`]
                    }`}
                  />
                  <div className={styles.wordText}>{word.word}</div>
                  {word.hint && (
                    <div className={styles.wordHint}>{word.hint}</div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className={styles.wordCount}>
            Showing {filteredWords.length} of {words.length} problems
          </div>

          <button
            className={styles.resetButton}
            onClick={() => setUsedWordIds([])}
          >
            Reset Used Problems
          </button>

          <div className={styles.keyboardShortcuts}>
            <strong>Shortcuts:</strong>
            <div>Space/Enter → Reveal</div>
            <div>C → Correct</div>
            <div>X → Wrong</div>
            <div>Esc → Clear</div>
          </div>
        </div>

        {/* CENTER PANEL - The Stage */}
        <div className={styles.centerPanel}>
          {/* Contestant Name Input (Host View Only) */}
          {isHostView && (
            <input
              type="text"
              className={styles.contestantInput}
              placeholder="Contestant solving this problem:"
              value={contestantName}
              onChange={(e) => setContestantName(e.target.value)}
            />
          )}

          {/* Stage Card */}
          {selectedWord ? (
            <div className={styles.stageCard}>
              {/* Header */}
              <div className={styles.stageHeader}>
                <div className={styles.badgeSection}>{selectedWord.section}</div>
                <div
                  className={`${styles.badgeDifficulty} ${
                    styles[selectedWord.difficulty || 'easy']
                  }`}
                >
                  {selectedWord.difficulty?.toUpperCase() || 'EASY'}
                </div>
              </div>

              {/* Word Display */}
              <div
                className={revealed ? styles.revealedWord : styles.blurredWord}
              >
                {selectedWord.word}
              </div>

              {/* Contestant Name */}
              {contestantName && (
                <div
                  className={styles.contestantName}
                  style={
                    contestantFlash
                      ? {
                          fontSize: '24px',
                          fontFamily: "'Bebas Neue', sans-serif",
                          color: '#ffd700',
                          animation: 'pulse 0.5s ease 4',
                        }
                      : {}
                  }
                >
                  {contestantName}
                </div>
              )}

              {/* Hint */}
              {revealed && selectedWord.hint && (
                <div className={styles.hint}>💡 {selectedWord.hint}</div>
              )}

              {/* Buttons */}
              <div className={styles.buttonGroup}>
                {!revealed && (
                  <>
                    <button
                      className={styles.hearButton}
                      onClick={handleHearWord}
                    >
                      🔊 Hear Problem
                    </button>
                    {isHostView && (
                      <button
                        className={styles.revealButton}
                        onClick={handleReveal}
                      >
                        👁 Reveal Problem
                      </button>
                    )}
                  </>
                )}

                {revealed && animationState === 'idle' && isHostView && (
                  <>
                    <button
                      className={styles.correctButton}
                      onClick={handleCorrect}
                    >
                      ✅ CORRECT
                    </button>
                    <button
                      className={styles.wrongButton}
                      onClick={handleWrong}
                    >
                      ❌ WRONG
                    </button>
                  </>
                )}
              </div>

              {/* Next Word Button */}
              {animationState !== 'idle' && isHostView && (
                <button
                  className={styles.nextButton}
                  onClick={() => {
                    setSelectedWord(null)
                    setRevealed(false)
                    setAnimationState('idle')
                  }}
                >
                  Next Problem
                </button>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Image
                src="/logo.jpeg"
                alt="School Logo"
                width={120}
                height={120}
                className={styles.schoolLogo}
              />
              <div className={styles.emptyStateTitle}>
                Seat of Wisdom<br />Maths Olympiad
              </div>
              {isHostView ? (
                <div className={styles.emptyStateSubtitle}>
                  Select a problem to begin
                </div>
              ) : (
                <div className={styles.emptyStateSubtitle}>
                  Get ready...
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Live Scoreboard */}
        <div className={styles.rightPanel}>
          <div className={styles.scoreboardTitle}>{activeSection}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            (Scores updating live)
          </div>
        </div>
      </div>
    </div>
  )
}
