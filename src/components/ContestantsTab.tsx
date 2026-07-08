'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Contestant, Section } from '@/lib/types'
import { supabaseServer } from '@/lib/supabase'
import { apiPost, apiPut, apiDelete } from '@/lib/clientApi'
import {
  validateAddContestantForm,
  validateBulkAddForm,
  formatErrors,
} from '@/lib/clientValidation'
import styles from './ContestantsTab.module.css'

// Dynamically import modal to reduce bundle size
const ImageUploadModal = dynamic(() => import('./ImageUploadModal'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

interface ContestantsTabProps {
  contestants: Contestant[]
  sections: Section[]
  onRefresh: () => void
}

export default function ContestantsTab({
  contestants,
  sections,
  onRefresh,
}: ContestantsTabProps) {
  const [name, setName] = useState('')
  const [section, setSection] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [bulkNames, setBulkNames] = useState('')
  const [bulkSection, setBulkSection] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSection, setEditSection] = useState('')
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('')
  const [editPictureFile, setEditPictureFile] = useState<File | null>(null)
  const [imageUploadContestant, setImageUploadContestant] = useState<Contestant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSection, setFilterSection] = useState<string>('')

  // Filter and search contestants
  const filteredContestants = useMemo(() => {
    let filtered = [...contestants]

    // Filter by section if selected
    if (filterSection) {
      filtered = filtered.filter((c) => c.section === filterSection)
    }

    // Search by name
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(query))
    }

    return filtered
  }, [contestants, searchQuery, filterSection])

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Client-side validation
    const validation = validateAddContestantForm(name, section, youtubeUrl)
    if (!validation.valid) {
      setError(formatErrors(validation.errors))
      return
    }

    setLoading(true)
    try {
      await apiPost('/api/contestants', {
        name,
        section,
        youtube_url: youtubeUrl || null,
      })
      setName('')
      setYoutubeUrl('')
      setSection('')
      setError(null)
      onRefresh()
    } catch (err) {
      setError(`Failed to add contestant: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAdd = async () => {
    setError(null)

    // Client-side validation
    const validation = validateBulkAddForm(bulkNames, bulkSection)
    if (!validation.valid) {
      setError(formatErrors(validation.errors))
      return
    }

    const names = bulkNames.split('\n').filter((n) => n.trim())

    setLoading(true)
    try {
      for (const n of names.slice(0, 10)) {
        await apiPost('/api/contestants', {
          name: n.trim(),
          section: bulkSection,
          youtube_url: null,
        })
      }
      setBulkNames('')
      setBulkSection('')
      setError(null)
      onRefresh()
    } catch (err) {
      setError(`Failed to bulk add: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContestant = async (id: string) => {
    if (!confirm('Are you sure?')) return

    setError(null)
    try {
      await apiDelete(`/api/contestants?id=${id}`)
      onRefresh()
    } catch (err) {
      setError(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleEditClick = (contestant: Contestant) => {
    setEditingId(contestant.id)
    setEditName(contestant.name)
    setEditSection(contestant.section)
    setEditYoutubeUrl(contestant.youtube_url || '')
    setError(null)
  }

  const handleSaveEdit = async (id: string) => {
    // Client-side validation
    const nameErr = !editName || editName.length === 0 ? 'Name is required' : null
    if (nameErr) {
      setError(nameErr)
      return
    }

    setLoading(true)
    try {
      let pictureUrl = undefined

      // Upload picture if selected
      if (editPictureFile) {
        const fileName = `${Date.now()}-${editPictureFile.name}`
        const { error: uploadError } = await supabaseServer.storage
          .from('contestant-pictures')
          .upload(fileName, editPictureFile)

        if (uploadError) throw uploadError

        const { data: publicUrl } = supabaseServer.storage
          .from('contestant-pictures')
          .getPublicUrl(fileName)

        pictureUrl = publicUrl.publicUrl
      }

      await apiPut('/api/contestants', {
        id,
        name: editName,
        section: editSection,
        youtube_url: editYoutubeUrl || null,
        ...(pictureUrl && { picture_url: pictureUrl }),
      })
      setEditingId(null)
      setEditPictureFile(null)
      setError(null)
      onRefresh()
    } catch (err) {
      setError(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditSection('')
    setEditYoutubeUrl('')
    setError(null)
  }

  const handleImageUploadOpen = (contestant: Contestant) => {
    setImageUploadContestant(contestant)
    setError(null)
  }

  const handleImageUploadClose = () => {
    setImageUploadContestant(null)
  }

  const handleImageUploadComplete = () => {
    setImageUploadContestant(null)
    onRefresh()
  }

  return (
    <>
      <div className={styles.container}>
        {error && (
          <div
            className={styles.errorBanner}
            role="alert"
            aria-live="polite"
            style={{
              backgroundColor: '#FF6B9D',
              color: '#090d26',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontWeight: 'bold',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Add Single Contestant</h3>
          <form className={styles.form} onSubmit={handleAddContestant}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contestant name"
                required
                aria-required="true"
                aria-describedby={error ? 'error-banner' : undefined}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="section">
                Section *
              </label>
              <select
                id="section"
                className={styles.select}
                value={section}
                onChange={(e) => setSection(e.target.value)}
                required
                aria-required="true"
              >
                <option value="">Select section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="youtubeUrl">
                YouTube URL
              </label>
              <input
                id="youtubeUrl"
                type="text"
                className={styles.input}
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-describedby="youtube-help"
              />
              <small id="youtube-help" style={{ color: '#00e5ff', marginTop: '4px' }}>
                Optional: Link to intro video
              </small>
            </div>
            <button type="submit" className={styles.button} disabled={loading} aria-busy={loading}>
              {loading ? 'Adding...' : 'Add Contestant'}
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bulk Add (up to 10)</h3>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="bulkNames">
                Names (one per line) *
              </label>
              <textarea
                id="bulkNames"
                className={styles.textarea}
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder="Name 1&#10;Name 2&#10;Name 3..."
                required
                aria-required="true"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="bulkSection">
                Section *
              </label>
              <select
                id="bulkSection"
                className={styles.select}
                value={bulkSection}
                onChange={(e) => setBulkSection(e.target.value)}
                required
                aria-required="true"
              >
                <option value="">Select section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={handleBulkAdd}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Adding...' : 'Bulk Add'}
            </button>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>All Contestants</h3>
            
            {/* Search and Filter Section */}
            <div className={styles.filterContainer}>
              <div className={styles.filterGroup}>
                <label className={styles.label} htmlFor="searchInput">
                  Search by Name
                </label>
                <input
                  id="searchInput"
                  type="text"
                  className={styles.input}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type contestant name..."
                  aria-label="Search contestants by name"
                />
              </div>
              <div className={styles.filterGroup}>
                <label className={styles.label} htmlFor="filterSelect">
                  Filter by Category
                </label>
                <select
                  id="filterSelect"
                  className={styles.select}
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  aria-label="Filter contestants by category/section"
                >
                  <option value="">All Categories</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.resultCount}>
                {filteredContestants.length} of {contestants.length} contestants
              </div>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Picture</th>
                    <th>Name</th>
                    <th>Section</th>
                    <th>Score</th>
                    <th>Video</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContestants.length > 0 ? (
                    filteredContestants.map((c) => (
                      <tr key={c.id}>
                        <td>
                          {editingId === c.id ? (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => setEditPictureFile(e.target.files?.[0] || null)}
                              style={{ fontSize: '11px' }}
                            />
                          ) : c.picture_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.picture_url} alt={c.name} className={styles.pictureThumb} />
                          ) : (
                            '–'
                          )}
                        </td>
                        <td>
                          {editingId === c.id ? (
                            <input
                              type="text"
                              className={styles.input}
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                          ) : (
                            c.name
                          )}
                        </td>
                        <td>
                          {editingId === c.id ? (
                            <select
                              className={styles.select}
                              value={editSection}
                              onChange={(e) => setEditSection(e.target.value)}
                            >
                              {sections.map((s) => (
                                <option key={s.id} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            c.section
                          )}
                        </td>
                        <td>{c.score}</td>
                        <td>
                          {editingId === c.id ? (
                            <input
                              type="text"
                              className={styles.input}
                              value={editYoutubeUrl}
                              onChange={(e) => setEditYoutubeUrl(e.target.value)}
                              placeholder="YouTube URL"
                            />
                          ) : (
                            c.youtube_url ? '✓' : '–'
                          )}
                        </td>
                        <td>
                          <div className={styles.actionButtons}>
                            {editingId === c.id ? (
                              <>
                                <button
                                  className={styles.buttonSmall}
                                  onClick={() => handleSaveEdit(c.id)}
                                  disabled={loading}
                                >
                                  {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                  className={`${styles.buttonSmall} ${styles.buttonSmallDanger}`}
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className={styles.buttonSmall}
                                  onClick={() => handleImageUploadOpen(c)}
                                  title="Upload picture"
                                >
                                  📷
                                </button>
                                <button
                                  className={styles.buttonSmall}
                                  onClick={() => handleEditClick(c)}
                                >
                                  Edit
                                </button>
                                <button
                                  className={`${styles.buttonSmall} ${styles.buttonSmallDanger}`}
                                  onClick={() => handleDeleteContestant(c.id)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.noResults}>
                        No contestants found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {imageUploadContestant && (
        <ImageUploadModal
          contestant={imageUploadContestant}
          isOpen={true}
          onClose={handleImageUploadClose}
          onUploadComplete={handleImageUploadComplete}
        />
      )}
    </>
  )
}
