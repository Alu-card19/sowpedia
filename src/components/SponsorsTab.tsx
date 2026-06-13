'use client'

import { useState } from 'react'
import { Sponsor } from '@/lib/types'
import { apiPostFormData, apiDelete } from '@/lib/clientApi'
import styles from './SponsorsTab.module.css'

interface SponsorsTabProps {
  sponsors: Sponsor[]
  onRefresh: () => void
}

export default function SponsorsTab({ sponsors, onRefresh }: SponsorsTabProps) {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      setFile(f)
      setFileName(f.name)
    }
  }

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('file', file)

      await apiPostFormData('/api/sponsors', formData)
      setName('')
      setFile(null)
      setFileName('')
      onRefresh()
    } catch (error) {
      console.error('Error adding sponsor:', error)
      alert(`Failed to add sponsor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Delete this sponsor?')) return

    try {
      await apiDelete(`/api/sponsors?id=${id}`)
      onRefresh()
    } catch (error) {
      console.error('Error deleting:', error)
      alert(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Add Sponsor</h3>
        <form className={styles.form} onSubmit={handleAddSponsor}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Sponsor Name</label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sponsor name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="logoFile" className={styles.fileLabel}>
              {fileName || 'Choose Logo (JPG/PNG/WebP, max 2MB)'}
            </label>
            <input
              id="logoFile"
              type="file"
              className={styles.fileInput}
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            {fileName && <div className={styles.fileName}>Selected: {fileName}</div>}
          </div>
          <button type="submit" className={styles.button} disabled={loading || !name || !file}>
            {loading ? 'Adding...' : 'Add Sponsor'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>All Sponsors</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Logo</th>
                <th>Name</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsors.map((s) => (
                <tr key={s.id}>
                  <td>
                    {s.logo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.logo_url} alt={s.name} className={styles.logoThumb} />
                    )}
                  </td>
                  <td>{s.name}</td>
                  <td>{s.order_index}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button className={styles.buttonSmall} onClick={() => alert('Edit: ' + s.name)}>
                        Edit
                      </button>
                      <button
                        className={`${styles.buttonSmall} ${styles.buttonSmallDanger}`}
                        onClick={() => handleDeleteSponsor(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
