/**
 * Custom hook for managing score updates with debouncing and batching
 */

import { useCallback, useRef, useState } from 'react'
import { getUserFriendlyMessage, logError } from '@/lib/errors'

interface ScoreUpdateParams {
  id: string
  score: number
  adminPassword: string
}

export function useScoreUpdate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const batchUpdatesRef = useRef<Map<string, number>>(new Map())

  const updateScore = useCallback(
    async (params: ScoreUpdateParams): Promise<boolean> => {
      try {
        setError(null)

        const response = await fetch('/api/scores', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': params.adminPassword,
          },
          body: JSON.stringify({
            id: params.id,
            score: params.score,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMsg = data.error || 'Failed to update score'
          setError(errorMsg)
          logError(errorMsg, 'SCORE_UPDATE')
          return false
        }

        return true
      } catch (err) {
        const message = getUserFriendlyMessage(err)
        setError(message)
        logError(err, 'SCORE_UPDATE')
        return false
      }
    },
    []
  )

  const debouncedUpdateScore = useCallback(
    (params: ScoreUpdateParams, delay = 500) => {
      // Add to batch
      batchUpdatesRef.current.set(params.id, params.score)

      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounce timer
      debounceTimerRef.current = setTimeout(async () => {
        setLoading(true)

        try {
          // Process all batched updates
          const updates = Array.from(batchUpdatesRef.current.entries())
          batchUpdatesRef.current.clear()

          // Send updates (can be optimized to send in one batch if backend supports)
          for (const [id, score] of updates) {
            await updateScore({
              id,
              score,
              adminPassword: params.adminPassword,
            })
          }
        } finally {
          setLoading(false)
        }
      }, delay)
    },
    [updateScore]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const cancelPending = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    batchUpdatesRef.current.clear()
  }, [])

  return {
    updateScore,
    debouncedUpdateScore,
    loading,
    error,
    clearError,
    cancelPending,
  }
}
