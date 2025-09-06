"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface RateLimitData {
  allowed: boolean
  remainingUsage: number
  totalLimit: number
  resetTime: string
  currentUsage: number
  timeUntilReset: string
}

interface RateLimitsResponse {
  rateLimits: {
    QUICK_CHAT: RateLimitData
    STRUCTURED_ANALYSIS: RateLimitData
    DOCUMENT_GENERATION: RateLimitData
  }
}

interface RateLimitStatusProps {
  feature?: 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS' | 'DOCUMENT_GENERATION'
  compact?: boolean
}

export function RateLimitStatus({ feature, compact = false }: RateLimitStatusProps) {
  const [rateLimits, setRateLimits] = useState<RateLimitsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRateLimits = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/chat/rate-limits`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch rate limits')
      }

      const data: RateLimitsResponse = await response.json()
      setRateLimits(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRateLimits()
    // Refresh every minute
    const interval = setInterval(fetchRateLimits, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        Loading limits...
      </div>
    )
  }

  if (error || !rateLimits) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <AlertTriangle className="w-4 h-4" />
        Error loading limits
      </div>
    )
  }

  const getFeatureName = (featureType: string) => {
    switch (featureType) {
      case 'QUICK_CHAT': return 'Quick Chat'
      case 'STRUCTURED_ANALYSIS': return 'Legal Analysis'
      case 'DOCUMENT_GENERATION': return 'Document Generation'
      default: return featureType
    }
  }

  const getUsageColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage === 0) return 'text-red-600'
    if (percentage <= 25) return 'text-orange-600'
    return 'text-green-600'
  }

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage === 0) return 'bg-red-500'
    if (percentage <= 25) return 'bg-orange-500'
    return 'bg-green-500'
  }

  // If specific feature requested, show only that one
  if (feature && rateLimits.rateLimits[feature]) {
    const data = rateLimits.rateLimits[feature]
    
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-xs">
          <span className={getUsageColor(data.remainingUsage, data.totalLimit)}>
            {data.remainingUsage}/{data.totalLimit} left
          </span>
          <span className="text-gray-500">
            (resets in {data.timeUntilReset})
          </span>
        </div>
      )
    }

    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {data.remainingUsage > 0 ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            {getFeatureName(feature)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Usage:</span>
              <span className={getUsageColor(data.remainingUsage, data.totalLimit)}>
                {data.currentUsage}/{data.totalLimit}
              </span>
            </div>
            <Progress 
              value={(data.currentUsage / data.totalLimit) * 100} 
              className="h-2"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Resets in: {data.timeUntilReset}</span>
              {data.remainingUsage === 0 && (
                <Badge variant="destructive">Limit Reached</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show all features
  const features = [
    { key: 'QUICK_CHAT', data: rateLimits.rateLimits.QUICK_CHAT },
    { key: 'STRUCTURED_ANALYSIS', data: rateLimits.rateLimits.STRUCTURED_ANALYSIS },
    { key: 'DOCUMENT_GENERATION', data: rateLimits.rateLimits.DOCUMENT_GENERATION },
  ]

  if (compact) {
    return (
      <div className="space-y-1">
        {features.map(({ key, data }) => (
          <div key={key} className="flex items-center justify-between text-xs">
            <span>{getFeatureName(key)}:</span>
            <div className="flex items-center gap-1">
              <span className={getUsageColor(data.remainingUsage, data.totalLimit)}>
                {data.remainingUsage}/{data.totalLimit}
              </span>
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-500">{data.timeUntilReset}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Daily Usage Limits</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map(({ key, data }) => (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {data.remainingUsage > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                {getFeatureName(key)}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Used:</span>
                  <span className={getUsageColor(data.remainingUsage, data.totalLimit)}>
                    {data.currentUsage}/{data.totalLimit}
                  </span>
                </div>
                <Progress 
                  value={(data.currentUsage / data.totalLimit) * 100} 
                  className="h-2"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Resets: {data.timeUntilReset}</span>
                  {data.remainingUsage === 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Limit Reached
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default RateLimitStatus