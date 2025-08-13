import { useState, useCallback } from 'react'

export interface ClipboardResult {
  success: boolean
  data?: Record<string, any>
  error?: string
}

export interface UseClipboardReturn {
  pasteFromClipboard: () => Promise<ClipboardResult>
  isLoading: boolean
  lastResult: ClipboardResult | null
}

export function useClipboard(): UseClipboardReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<ClipboardResult | null>(null)

  const pasteFromClipboard = useCallback(async (): Promise<ClipboardResult> => {
    setIsLoading(true)
    
    try {
      // Check if clipboard API is available
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        const result: ClipboardResult = {
          success: false,
          error: 'Clipboard API is not supported in this browser'
        }
        setLastResult(result)
        return result
      }

      // Read text from clipboard
      const text = await navigator.clipboard.readText()
      
      if (!text.trim()) {
        const result: ClipboardResult = {
          success: false,
          error: 'Clipboard is empty'
        }
        setLastResult(result)
        return result
      }

      // Try to parse as JSON
      let parsedData: any
      try {
        parsedData = JSON.parse(text)
      } catch (parseError) {
        const result: ClipboardResult = {
          success: false,
          error: 'Clipboard content is not valid JSON format'
        }
        setLastResult(result)
        return result
      }

      // Ensure the parsed data is an object
      if (typeof parsedData !== 'object' || parsedData === null || Array.isArray(parsedData)) {
        const result: ClipboardResult = {
          success: false,
          error: 'JSON must be an object with key-value pairs'
        }
        setLastResult(result)
        return result
      }

      // Sanitize the data to prevent XSS
      const sanitizedData = sanitizeObject(parsedData)

      const result: ClipboardResult = {
        success: true,
        data: sanitizedData
      }
      setLastResult(result)
      return result

    } catch (error) {
      const result: ClipboardResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to read from clipboard'
      }
      setLastResult(result)
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    pasteFromClipboard,
    isLoading,
    lastResult
  }
}

function sanitizeObject(obj: any, maxDepth: number = 3, currentDepth: number = 0): Record<string, any> {
  if (currentDepth >= maxDepth) {
    return {}
  }

  const sanitized: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    // Sanitize key to prevent prototype pollution
    if (typeof key !== 'string' || key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue
    }

    // Sanitize and process value based on type
    if (value === null || value === undefined) {
      sanitized[key] = ''
    } else if (typeof value === 'string') {
      // Basic XSS prevention - remove potentially dangerous content
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim()
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = String(value)
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively sanitize nested objects (with depth limit)
      const nested = sanitizeObject(value, maxDepth, currentDepth + 1)
      if (Object.keys(nested).length > 0) {
        sanitized[key] = JSON.stringify(nested)
      }
    } else if (Array.isArray(value)) {
      // Convert arrays to string representation
      try {
        sanitized[key] = JSON.stringify(value.filter(item => 
          typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
        ))
      } catch {
        sanitized[key] = ''
      }
    } else {
      // Convert other types to string
      sanitized[key] = String(value)
    }
  }

  return sanitized
}