"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  picture: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
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
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Auth success: User authenticated', data.user.email)
        setUser(data.user)
      } else {
        // Backend handles all cookie clearing - we just clear local state
        console.log('Auth failed: Clearing user state', response.status)
        setUser(null)
        
        if (response.status !== 401 && response.status !== 403) {
          console.error('Unexpected auth error:', response.status, response.statusText)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    }
  }

  const login = async () => {
    try {
      setIsLoading(true)
      
      // Clear any stale authentication state first - backend handles cookies
      setUser(null)
      
      const response = await fetch('http://localhost:5000/api/auth/google', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Redirecting to Google OAuth')
        window.location.href = data.url
      } else {
        throw new Error('Failed to get auth URL')
      }
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser()
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Handle OAuth callback with proper error handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authStatus = urlParams.get('auth')
    const errorParam = urlParams.get('error')
    
    if (authStatus === 'success') {
      console.log('OAuth callback success - refreshing user')
      refreshUser().then(() => {
        // Clean up URL after successful auth
        window.history.replaceState({}, document.title, window.location.pathname)
      })
    } else if (errorParam) {
      console.error('OAuth callback error:', errorParam, urlParams.get('details'))
      setUser(null)
      setIsLoading(false)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}