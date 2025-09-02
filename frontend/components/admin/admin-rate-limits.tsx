"use client"

import { useState, useEffect } from 'react'

interface RateLimit {
  featureType: string
  limit: number
  description: string
}

interface AdminRateLimitsProps {
  className?: string
}

export function AdminRateLimits({ className = "" }: AdminRateLimitsProps) {
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingLimits, setEditingLimits] = useState<Record<string, number>>({})

  const fetchRateLimits = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/admin/rate-limits', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch rate limits')
      }

      const data = await response.json()
      setRateLimits(data)
      
      // Initialize editing state
      const editing: Record<string, number> = {}
      data.forEach((rl: RateLimit) => {
        editing[rl.featureType] = rl.limit
      })
      setEditingLimits(editing)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rate limits')
    } finally {
      setLoading(false)
    }
  }

  const saveRateLimits = async () => {
    try {
      setSaving(true)
      setError(null)

      const updates = Object.entries(editingLimits).map(([featureType, newLimit]) => ({
        featureType,
        newLimit
      }))

      const response = await fetch('http://localhost:5000/api/admin/rate-limits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ updates })
      })

      if (!response.ok) {
        throw new Error('Failed to update rate limits')
      }

      await fetchRateLimits() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update rate limits')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchRateLimits()
  }, [])

  const handleLimitChange = (featureType: string, value: string) => {
    const numValue = parseInt(value) || 0
    setEditingLimits(prev => ({
      ...prev,
      [featureType]: numValue
    }))
  }

  const hasChanges = rateLimits.some(rl => 
    editingLimits[rl.featureType] !== rl.limit
  )

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <h2 className="text-lg font-semibold mb-4">Rate Limits</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <h2 className="text-lg font-semibold mb-4">Rate Limits</h2>
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Rate Limits Configuration</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {rateLimits.map((rateLimit) => (
            <div key={rateLimit.featureType} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  {rateLimit.featureType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingLimits[rateLimit.featureType] || 0}
                    onChange={(e) => handleLimitChange(rateLimit.featureType, e.target.value)}
                    className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">per day</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{rateLimit.description}</p>
            </div>
          ))}
        </div>

        {hasChanges && (
          <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-700">You have unsaved changes</p>
            <button
              onClick={saveRateLimits}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}