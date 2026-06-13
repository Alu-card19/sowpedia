'use client'

import { useState, useRef } from 'react'
import { Contestant } from '@/lib/types'
import Image from 'next/image'
import { getSupabase } from '@/lib/supabase'
import { apiRawFetch } from '@/lib/clientApi'
import styles from './ImageUploadModal.module.css'

interface ImageUploadModalProps {
  contestant: Contestant
  isOpen: boolean
  onClose: () => void
  onUploadComplete: () => void
}

export default function ImageUploadModal({
  contestant,
  isOpen,
  onClose,
  onUploadComplete,
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(contestant.picture_url || null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      const supabase = getSupabase()
      const fileName = `${contestant.id}-${Date.now()}.${file.name.split('.').pop()}`

      // Upload file
      setProgress(30)
      const { error: uploadError } = await supabase.storage
        .from('contestant-pictures')
        .upload(fileName, file, {
          upsert: true,
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        throw uploadError
      }

      setProgress(60)

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('contestant-pictures')
        .getPublicUrl(fileName)

      if (!publicUrl?.publicUrl) {
        throw new Error('Failed to generate public URL')
      }

      setProgress(80)

      // Update contestant in database
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      if (!adminPassword) {
        throw new Error('Admin password not configured')
      }

      const res = await apiRawFetch('/api/contestants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contestant.id,
          picture_url: publicUrl.publicUrl,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        console.error('API response error:', { status: res.status, error: errorData })
        throw new Error(`Failed to update contestant: ${errorData.error || res.statusText}`)
      }

      setProgress(100)
      setFile(null)
      onUploadComplete()

      // Close modal after success
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (error) {
      console.error('Upload error:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemoveImage = async () => {
    if (!confirm('Remove this image?')) return

    try {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      if (!adminPassword) {
        throw new Error('Admin password not configured')
      }

      const res = await apiRawFetch('/api/contestants', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contestant.id,
          picture_url: null,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(`Failed to remove image: ${errorData.error || res.statusText}`)
      }

      setPreview(null)
      onUploadComplete()
    } catch (error) {
      console.error('Error removing image:', error)
      alert(`Failed to remove image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="presentation">
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="upload-modal-title"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="upload-modal-title">Upload Picture</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close upload dialog"
            title="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.contestantName}>{contestant.name}</p>

          {/* Preview */}
          {preview && (
            <div className={styles.previewContainer}>
              {preview.startsWith('data:') ? (
                // Local preview - use img tag
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt={`Current picture for ${contestant.name}`} className={styles.preview} />
              ) : (
                // Uploaded image - use Image component
                <Image
                  src={preview}
                  alt={`Current picture for ${contestant.name}`}
                  fill
                  className={styles.preview}
                  style={{ objectFit: 'cover' }}
                  sizes="300px"
                />
              )}
            </div>
          )}

          {/* File Input */}
          <div className={styles.fileInputWrapper}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={uploading}
              aria-label="Select image file"
              aria-describedby="file-format-help"
            />
            <button
              type="button"
              className={styles.selectButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label={file ? `Change image (current: ${file.name})` : 'Select image file'}
            >
              {file ? 'Change Image' : 'Select Image'}
            </button>
            <span id="file-format-help" className="srOnly">
              Accepted formats: JPEG, PNG, WebP, SVG. Maximum file size: 5MB
            </span>
          </div>

          {file && <p className={styles.fileName} aria-live="polite">{file.name}</p>}

          {/* Progress Bar */}
          {uploading && progress > 0 && (
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Upload progress"
              >
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <p className={styles.progressText} aria-live="polite">{progress}% complete</p>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          {preview && !file && (
            <button
              type="button"
              className={`${styles.button} ${styles.buttonDanger}`}
              onClick={handleRemoveImage}
              disabled={uploading}
              aria-label={`Remove current picture for ${contestant.name}`}
            >
              Remove Current
            </button>
          )}
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={handleUpload}
            disabled={!file || uploading}
            aria-busy={uploading}
          >
            {uploading ? `Uploading... ${progress}%` : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  )
}
