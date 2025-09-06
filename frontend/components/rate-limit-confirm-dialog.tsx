"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Scale, FileText, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type FeatureType = 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS' | 'DOCUMENT_GENERATION'

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

interface RateLimitConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  featureType: FeatureType
  onConfirm: () => void
}

const FEATURE_CONFIG = {
  QUICK_CHAT: {
    title: 'Quick Chat',
    description: 'Get instant answers to your legal questions',
    icon: MessageCircle,
    color: '#7C9885',
    gradient: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    actionWord: { singular: 'message', plural: 'messages' },
    actionVerb: 'send',
  },
  STRUCTURED_ANALYSIS: {
    title: 'Legal Analysis',
    description: 'Get detailed, structured legal guidance with actionable steps',
    icon: Scale,
    color: '#C99383',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    actionWord: { singular: 'analysis', plural: 'analyses' },
    actionVerb: 'perform',
  },
  DOCUMENT_GENERATION: {
    title: 'Document Generation',
    description: 'Create professional legal documents tailored to your needs',
    icon: FileText,
    color: '#F7DC6F',
    gradient: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    actionWord: { singular: 'document', plural: 'documents' },
    actionVerb: 'create',
  },
} as const

export function RateLimitConfirmDialog({ 
  open, 
  onOpenChange, 
  featureType, 
  onConfirm 
}: RateLimitConfirmDialogProps) {
  const [rateLimits, setRateLimits] = useState<RateLimitsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const config = FEATURE_CONFIG[featureType]
  const IconComponent = config.icon

  const fetchRateLimits = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/chat/rate-limits`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch rate limits')
      }

      const data: RateLimitsResponse = await response.json()
      setRateLimits(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchRateLimits()
    }
  }, [open])

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const rateLimitData = rateLimits?.rateLimits[featureType]
  const canProceed = rateLimitData?.remainingUsage > 0
  const usagePercentage = rateLimitData 
    ? (rateLimitData.currentUsage / rateLimitData.totalLimit) * 100 
    : 0

  // Generate positive usage message
  const getUsageMessage = () => {
    if (!rateLimitData) return ''
    
    const remaining = rateLimitData.remainingUsage
    const actionWord = remaining === 1 ? config.actionWord.singular : config.actionWord.plural
    
    return `You can ${config.actionVerb} ${remaining} ${actionWord}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-lg" style={{ backgroundColor: '#FEFCF3' }}>
        <VisuallyHidden>
          <DialogTitle>{config.title} Usage</DialogTitle>
          <DialogDescription>
            Check your daily usage limits for {config.title.toLowerCase()} before proceeding.
          </DialogDescription>
        </VisuallyHidden>
        <div className="py-4 px-2 sm:py-6 sm:px-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <span className="text-sm">Failed to load usage information</span>
            </div>
          ) : rateLimitData ? (
            <div className="text-center space-y-3">
              {canProceed ? (
                <div className="text-sm text-gray-700">
                  {getUsageMessage()}
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  You've reached your daily limit for this feature. Please wait for the reset or try another feature.
                </div>
              )}
              
              <div className="text-sm text-gray-700">
                Resets in <strong>{rateLimitData.timeUntilReset}</strong>
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex flex-row gap-2 px-2 sm:px-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || error !== null || !canProceed}
            className="flex-1"
            style={{
              backgroundColor: canProceed ? config.color : undefined,
              borderColor: canProceed ? config.color : undefined,
              color: canProceed && featureType === 'DOCUMENT_GENERATION' ? '#2D3748' : undefined,
            }}
          >
            {canProceed ? 'Continue' : 'Limit Reached'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RateLimitConfirmDialog