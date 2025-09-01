"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  picture: string
}

interface AuthError {
  message: string
  code: string
  showToUser: boolean
}

type AuthLoadingContext = {
  message: string
  subtitle: string
  showProgress: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isLoggingOut: boolean
  isAuthenticated: boolean
  authError: AuthError | null
  isValidatingToken: boolean
  loadingContext: AuthLoadingContext
  isRedirecting: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  clearAuthError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [authError, setAuthError] = useState<AuthError | null>(null)
  const [isValidatingToken, setIsValidatingToken] = useState(true) // Show loading on app load
  const [loadingContext, setLoadingContext] = useState<AuthLoadingContext>({
    message: "Sheria Smart",
    subtitle: "Checking your session...",
    showProgress: true
  })
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const router = useRouter()

  const clearAuthError = () => {
    setAuthError(null)
  }

  // Helper function to ensure minimum loading duration
  const ensureMinimumLoadingDuration = async (startTime: number, minDuration = 1500) => {
    const elapsedTime = Date.now() - startTime
    const remainingTime = minDuration - elapsedTime
    
    if (remainingTime > 0) {
      console.log(`🔍 AUTH: Waiting additional ${remainingTime}ms to meet minimum loading duration`)
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }
  }

  // NEW: Secure token validation with backend verification
  const validateToken = async (context?: Partial<AuthLoadingContext>): Promise<boolean> => {
    console.log('🔍 AUTH: Starting token validation...')
    const startTime = Date.now()
    setLoadingStartTime(startTime)
    setIsValidatingToken(true)
    setAuthError(null)
    
    // Update loading context if provided
    if (context) {
      setLoadingContext(prev => ({ ...prev, ...context }))
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/validate-token', {
        credentials: 'include'
      })
      
      console.log('🔍 AUTH: Token validation response:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 AUTH: Token valid, user authenticated:', data.user.email)
        setUser(data.user)
        
        // Ensure minimum loading duration for better UX
        await ensureMinimumLoadingDuration(startTime)
        
        setIsValidatingToken(false)
        return true
      } else {
        // Handle different types of auth failures
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { error: 'Unknown authentication error', code: 'UNKNOWN' }
        }

        console.log('🔍 AUTH: Token validation failed:', errorData)
        
        // Clear user state
        setUser(null)
        
        // Set appropriate error message based on error code
        let errorMessage = ''
        let showToUser = true
        
        switch (errorData.code) {
          case 'TOKEN_EXPIRED':
            errorMessage = 'Your session has expired. Please log in again.'
            break
          case 'USER_NOT_FOUND':
            errorMessage = 'Your account was not found. Please create a new account.'
            break
          case 'TOKEN_MISSING':
            // Don't show error for missing token - user just needs to login
            showToUser = false
            break
          case 'TOKEN_TAMPERED':
            errorMessage = 'Security issue detected. Please log in again.'
            break
          default:
            errorMessage = 'Session invalid. Please log in again.'
        }

        if (showToUser) {
          setAuthError({
            message: errorMessage,
            code: errorData.code,
            showToUser: true
          })
        }

        // Ensure minimum loading duration for better UX
        await ensureMinimumLoadingDuration(startTime)
        
        setIsValidatingToken(false)
        return false
      }
    } catch (error) {
      console.error('🔍 AUTH: Token validation network error:', error)
      setUser(null)
      setAuthError({
        message: 'Unable to verify your session. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
        showToUser: true
      })
      
      // Ensure minimum loading duration for better UX
      await ensureMinimumLoadingDuration(startTime)
      
      setIsValidatingToken(false)
      return false
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      setAuthError(null)
      
      // Clear any stale authentication state first
      setUser(null)
      
      const response = await fetch('http://localhost:5000/api/auth/google', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 AUTH: Redirecting to Google OAuth')
        window.location.href = data.url
      } else {
        throw new Error('Failed to get authentication URL')
      }
    } catch (error) {
      console.error('🔍 AUTH: Login error:', error)
      setAuthError({
        message: 'Unable to start login process. Please try again.',
        code: 'LOGIN_FAILED',
        showToUser: true
      })
      setIsLoading(false)
    }
  }

  const logout = async () => {
    const startTime = Date.now()
    try {
      setIsLoggingOut(true)
      setLoadingContext({
        message: "Sheria Smart",
        subtitle: "Signing you out...",
        showProgress: true
      })
      
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
      setAuthError(null)
      console.log('🔍 AUTH: Logout successful')
      
      // Ensure minimum loading duration of 3 seconds
      await ensureMinimumLoadingDuration(startTime, 3000)
      
    } catch (error) {
      console.error('🔍 AUTH: Logout error:', error)
      // Still clear user state even if logout call fails
      setUser(null)
      
      // Ensure minimum loading duration even on error
      await ensureMinimumLoadingDuration(startTime, 3000)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Track client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Unified auth initialization - handles both normal load and OAuth callback
  useEffect(() => {
    // Only run after client-side mount to prevent hydration mismatches
    if (!hasMounted) return
    
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    const errorParam = urlParams.get('error')
    const errorDetails = urlParams.get('details')
    
    if (authStatus === 'success') {
      console.log('🔍 AUTH: OAuth callback success - validating token')
      // Keep consistent loading message for both OAuth and normal flows
      validateToken().then((isValid) => {
        if (isValid) {
          // Clean up URL after successful auth
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      })
    } else if (errorParam) {
      console.error('🔍 AUTH: OAuth callback error:', errorParam, errorDetails)
      
      // Map OAuth errors to user-friendly messages
      let errorMessage = ''
      switch (errorParam) {
        case 'oauth_failed':
          errorMessage = 'Google authentication failed. Please try again.'
          break
        case 'user_creation_failed':
          errorMessage = 'Unable to create your account. Please contact support.'
          break
        case 'token_generation_failed':
          errorMessage = 'Authentication error occurred. Please try again.'
          break
        case 'invalid_state':
          errorMessage = 'Security validation failed. Please try logging in again.'
          break
        default:
          errorMessage = 'Login failed. Please try again.'
      }
      
      setAuthError({
        message: errorMessage,
        code: errorParam.toUpperCase(),
        showToUser: true
      })
      
      setUser(null)
      setIsValidatingToken(false)
      setIsLoading(false)
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else {
      // Normal page load - start token validation
      console.log('🔍 AUTH: App loaded, starting token validation...')
      validateToken()
    }
  }, [hasMounted])

  // Auto-redirect to login page after showing error message
  useEffect(() => {
    if (authError && authError.showToUser && !isValidatingToken && !user) {
      // Show error for 3 seconds, then redirect to login
      const timer = setTimeout(() => {
        if (window.location.pathname !== '/login') {
          router.push('/login')
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [authError, isValidatingToken, user, router])

  const value: AuthContextType = {
    user,
    isLoading,
    isLoggingOut,
    isAuthenticated: !!user,
    authError,
    isValidatingToken,
    loadingContext,
    isRedirecting,
    login,
    logout,
    clearAuthError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}