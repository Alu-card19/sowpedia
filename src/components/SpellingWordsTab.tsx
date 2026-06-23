'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { SpellingWord } from '@/lib/types'
import styles from './SpellingWordsTab.module.css'

const SECTIONS = [
  'Little Sprouts',
  'Rising Explorers',
  'Builders League',
  'Champions Circle',
  'Elite Masters',
  'Grand Legends',
]

const DIFFICULTIES = ['easy', 'moderate', 'hard', 'champion']

/**
 * Fetch all spelling words with pagination to bypass 1000 row limit
 */
async function fetchAllSpellingWords(filters?: {
  section?: string
  difficulty?: string
}) {
  const PAGE_SIZE = 1000
  let allWords: SpellingWord[] = []
  let from = 0
  let hasMore = true

  while (hasMore) {
    let query = supabase
      .from('spelling_words')
      .select('*')
      .range(from, from + PAGE_SIZE - 1)
      .order('word', { ascending: true })

    if (filters?.section && filters.section !== 'All') {
      query = query.eq('section', filters.section)
    }

    if (filters?.difficulty && filters.difficulty !== 'All') {
      query = query.eq('difficulty', filters.difficulty)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) break

    allWords = [...allWords, ...data]
    from += PAGE_SIZE
    hasMore = data.length === PAGE_SIZE
  }

  return allWords
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SpellingWordsTab(_props?: { onRefresh?: () => void }) {
  const [words, setWords] = useState<SpellingWord[]>([])
  const [filterSection, setFilterSection] = useState<string>('All')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [deleteAllWord, setDeleteAllWord] = useState('')
  const [newWord, setNewWord] = useState({ word: '', section: '', difficulty: '', hint: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch words with pagination
  const fetchWords = async () => {
    setLoading(true)
    try {
      const data = await fetchAllSpellingWords()
      setWords(data || [])
    } catch (error) {
      console.error('Error fetching words:', error)
      alert('Failed to fetch words')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Filter words
  const filteredWords = words.filter((word) => {
    const matchSection = filterSection === 'All' || word.section === filterSection
    const matchDifficulty =
      filterDifficulty === 'All' || word.difficulty === filterDifficulty
    const matchSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSection && matchDifficulty && matchSearch
  })

  // Add word
  const handleAddWord = async () => {
    if (!newWord.word || !newWord.section || !newWord.difficulty) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('spelling_words')
        .insert([
          {
            word: newWord.word.trim(),
            section: newWord.section,
            difficulty: newWord.difficulty,
            hint: newWord.hint.trim() || null,
            used: false,
          },
        ])
        .select()

      if (error) throw error

      setWords([...words, data[0]])
      setNewWord({ word: '', section: '', difficulty: '', hint: '' })
      alert('Word added successfully')
    } catch (error) {
      console.error('Error adding word:', error)
      alert('Failed to add word')
    }
  }

  // Delete word
  const handleDeleteWord = async (id: string, wordText: string) => {
    if (!confirm(`Delete "${wordText}"?`)) return

    try {
      const res = await fetch(`/api/spelling-words?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': 'sow2025',
        },
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        alert(`Delete failed: ${err.error}`)
        return
      }

      // Remove word from local state immediately
      setWords((prev) => prev.filter((w) => w.id !== id))
      alert('Word deleted')
    } catch (error) {
      alert('Delete failed. Please check your connection and try again.')
      console.error('Delete error:', error)
    }
  }

  // Handle CSV import
  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportProgress(0)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter((line) => line.trim())
      const header = lines[0].toLowerCase().split(',').map((h) => h.trim())

      // Find column indices
      const wordIdx = header.indexOf('word')
      const sectionIdx = header.indexOf('section')
      const difficultyIdx = header.indexOf('difficulty')
      const hintIdx = header.indexOf('hint')

      if (wordIdx === -1 || sectionIdx === -1 || difficultyIdx === -1) {
        throw new Error('CSV must have: word, section, difficulty columns')
      }

      const rowsToInsert: Array<{
        word: string
        section: string
        difficulty: 'easy' | 'moderate' | 'hard' | 'champion'
        hint: string | null
        used: boolean
      }> = []

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        if (!line.trim()) continue

        const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))

        const word = {
          word: cells[wordIdx],
          section: cells[sectionIdx],
          difficulty: cells[difficultyIdx] as 'easy' | 'moderate' | 'hard' | 'champion',
          hint: hintIdx >= 0 ? cells[hintIdx] || null : null,
          used: false,
        }

        if (
          word.word &&
          word.section &&
          DIFFICULTIES.includes(word.difficulty)
        ) {
          rowsToInsert.push(word)
        }

        setImportProgress(Math.round((i / lines.length) * 100))
      }

      if (rowsToInsert.length === 0) {
        throw new Error('No valid words found in CSV')
      }

      // Insert in batches
      const batchSize = 50
      for (let i = 0; i < rowsToInsert.length; i += batchSize) {
        const batch = rowsToInsert.slice(i, i + batchSize)

        const { error: insertError } = await supabase
          .from('spelling_words')
          .insert(batch)
          .select()

        if (insertError) throw insertError

        setImportProgress(
          Math.round(((i + batch.length) / rowsToInsert.length) * 100)
        )
      }

      alert(`✅ ${rowsToInsert.length} words imported successfully`)
      await fetchWords()
    } catch (error) {
      console.error('Error importing CSV:', error)
      alert(`Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setImporting(false)
      setImportProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Delete all words in section
  const handleDeleteAllInSection = async (section: string) => {
    if (deleteAllWord !== 'DELETE') {
      alert("Type 'DELETE' to confirm")
      return
    }

    try {
      const res = await fetch(
        `/api/spelling-words?all=true&section=${encodeURIComponent(section)}`,
        {
          method: 'DELETE',
          headers: {
            'x-admin-password': 'sow2025',
          },
        }
      )

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        alert(`Delete failed: ${err.error}`)
        return
      }

      const result = await res.json()
      setWords((prev) => prev.filter((w) => w.section !== section))
      setDeleteAllWord('')
      alert(`All words in ${section} deleted (${result.count} words)`)
    } catch (error) {
      console.error('Error deleting section:', error)
      alert('Delete failed. Please check your connection and try again.')
    }
  }

  return (
    <div className={styles.container}>
      {/* Add Word Form */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Add New Word</h3>
        <div className={styles.formGrid}>
          <input
            type="text"
            placeholder="Word"
            value={newWord.word}
            onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
            className={styles.input}
          />
          <select
            value={newWord.section}
            onChange={(e) => setNewWord({ ...newWord, section: e.target.value })}
            className={styles.input}
          >
            <option value="">Select Section</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={newWord.difficulty}
            onChange={(e) => setNewWord({ ...newWord, difficulty: e.target.value })}
            className={styles.input}
          >
            <option value="">Select Difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Hint (optional)"
            value={newWord.hint}
            onChange={(e) => setNewWord({ ...newWord, hint: e.target.value })}
            className={styles.input}
          />
          <button onClick={handleAddWord} className={styles.buttonPrimary}>
            Add Word
          </button>
        </div>
      </div>

      {/* CSV Import */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Bulk Import (CSV)</h3>
        <div className={styles.importContainer}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCSVImport}
            disabled={importing}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className={styles.buttonSecondary}
          >
            {importing ? `Importing ${importProgress}%` : 'Choose CSV File'}
          </button>
          <p className={styles.helpText}>
            Expected columns: word, section, difficulty, hint
          </p>
        </div>
      </div>

      {/* Delete All Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Delete All Words in Section</h3>
        <div className={styles.deleteAllContainer}>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                if (window.confirm(`Delete all words in ${e.target.value}?`)) {
                  const confirmed = prompt("Type 'DELETE' to confirm deletion:")
                  if (confirmed === 'DELETE') {
                    handleDeleteAllInSection(e.target.value)
                  }
                }
              }
            }}
            className={styles.input}
          >
            <option value="">Select Section</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Words</h3>
        <div className={styles.filterBar}>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className={styles.select}
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.input}
          />
        </div>

        {loading ? (
          <div className={styles.loadingMessage}>Loading words...</div>
        ) : filteredWords.length === 0 ? (
          <div className={styles.emptyMessage}>No words found</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.cellWord}>Word</div>
              <div className={styles.cellSection}>Section</div>
              <div className={styles.cellDifficulty}>Difficulty</div>
              <div className={styles.cellHint}>Hint</div>
              <div className={styles.cellAction}>Action</div>
            </div>
            {filteredWords.map((word) => (
              <div key={word.id} className={styles.tableRow}>
                <div className={styles.cellWord}>{word.word}</div>
                <div className={styles.cellSection}>{word.section}</div>
                <div className={styles.cellDifficulty}>
                  <span
                    className={`${styles.badge} ${
                      styles[`badge_${word.difficulty || 'easy'}`]
                    }`}
                  >
                    {word.difficulty?.toUpperCase() || 'EASY'}
                  </span>
                </div>
                <div className={styles.cellHint}>{word.hint || '—'}</div>
                <div className={styles.cellAction}>
                  <button
                    onClick={() => handleDeleteWord(word.id, word.word)}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.wordCount}>
          Showing {filteredWords.length} of {words.length} words
        </div>
      </div>
    </div>
  )
}
