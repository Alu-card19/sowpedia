'use client'

import { useState } from 'react'
import { Contestant, Section } from '@/lib/types'
import { supabaseServer } from '@/lib/supabase'
import ImageUploadModal from './ImageUploadModal'
import styles from './ContestantsTab.module.css'

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSection, setEditSection] = useState('')
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('')
  const [editPictureFile, setEditPictureFile] = useState<File | null>(null)
  const [imageUploadContestant, setImageUploadContestant] = useState<Contestant | null>(null)

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !section) return

    setLoading(true)
    try {
      const res = await fetch('/api/contestants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025',
        },
        body: JSON.stringify({ name, section, youtube_url: youtubeUrl }),
      })

      if (res.ok) {
        setName('')
        setYoutubeUrl('')
        setSection('')
        onRefresh()
      }
    } catch (error) {
      console.error('Error adding contestant:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAdd = async () => {
    if (!bulkNames || !bulkSection) return

    const names = bulkNames.split('\n').filter((n) => n.trim())
    if (names.length === 0) return

    setLoading(true)
    try {
      for (const n of names.slice(0, 10)) {
        await fetch('/api/contestants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025',
          },
          body: JSON.stringify({ name: n.trim(), section: bulkSection }),
        })
      }
      setBulkNames('')
      setBulkSection('')
      onRefresh()
    } catch (error) {
      console.error('Error bulk adding:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContestant = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      await fetch(`/api/contestants?id=${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025',
        },
      })
      onRefresh()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleEditClick = (contestant: Contestant) => {
    setEditingId(contestant.id)
    setEditName(contestant.name)
    setEditSection(contestant.section)
    setEditYoutubeUrl(contestant.youtube_url || '')
  }

  const handleSaveEdit = async (id: string) => {
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

      await fetch('/api/contestants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'sow2025',
        },
        body: JSON.stringify({
          id,
          name: editName,
          section: editSection,
          youtube_url: editYoutubeUrl,
          ...(pictureUrl && { picture_url: pictureUrl }),
        }),
      })
      setEditingId(null)
      setEditPictureFile(null)
      onRefresh()
    } catch (error) {
      console.error('Error updating:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditSection('')
    setEditYoutubeUrl('')
  }

  const handleImageUploadOpen = (contestant: Contestant) => {
    setImageUploadContestant(contestant)
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
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Add Single Contestant</h3>
          <form className={styles.form} onSubmit={handleAddContestant}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contestant name"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Section</label>
              <select
                className={styles.select}
                value={section}
                onChange={(e) => setSection(e.target.value)}
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
              <label className={styles.label}>YouTube URL</label>
              <input
                type="text"
                className={styles.input}
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Adding...' : 'Add Contestant'}
            </button>
          </form>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Bulk Add (up to 10)</h3>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Names (one per line)</label>
              <textarea
                className={styles.textarea}
                value={bulkNames}
                onChange={(e) => setBulkNames(e.target.value)}
                placeholder="Name 1&#10;Name 2&#10;Name 3..."
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Section</label>
              <select
                className={styles.select}
                value={bulkSection}
                onChange={(e) => setBulkSection(e.target.value)}
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
            >
              {loading ? 'Adding...' : 'Bulk Add'}
            </button>
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>All Contestants</h3>
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
                  {contestants.map((c) => (
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
                  ))}
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
