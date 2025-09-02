"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { AuthError } from "@/components/auth-error"
import { AuthLoading } from "@/components/auth-loading"
import { AdminUsersList } from "@/components/admin/admin-users-list"
import { AdminRateLimits } from "@/components/admin/admin-rate-limits"

type AdminSection = 'overview' | 'users' | 'rate-limits'

interface PlatformStats {
  totalUsers: number
  totalChatSessions: number
  totalDocumentRequests: number
  recentUsers: number
}

export default function AdminPage() {
  const { user, isLoading, isLoggingOut, isAuthenticated, authError, isValidatingToken, loadingContext, clearAuthError } = useAuth()
  const router = useRouter()
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const [activeSection, setActiveSection] = useState<AdminSection>('overview')
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const [statsError, setStatsError] = useState<string | null>(null)

  // Fetch platform statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      setStatsError(null)
      
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch platform statistics')
      }

      const data: PlatformStats = await response.json()
      setStats(data)
    } catch (err) {
      setStatsError(err instanceof Error ? err.message : 'Failed to fetch statistics')
      console.error('Error fetching admin stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdminUser = user.email === 'swe.robertkibet@gmail.com' || user.isAdmin === true
      
      if (!isAdminUser) {
        // Not an admin, redirect to dashboard
        router.push('/dashboard')
        return
      }
      
      setIsCheckingAdmin(false)
    } else if (!isValidatingToken && !isLoading && !authError) {
      // Not authenticated, redirect to login
      router.push('/login')
    }
  }, [isAuthenticated, user, isValidatingToken, isLoading, authError, router])

  // Fetch stats when overview section is active and user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && activeSection === 'overview' && !isCheckingAdmin) {
      fetchStats()
    }
  }, [isAuthenticated, user, activeSection, isCheckingAdmin])

  // Helper function to format numbers
  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  // Helper function to get card value
  const getCardValue = (type: 'users' | 'sessions' | 'documents' | 'recent'): string => {
    if (statsLoading) return 'Loading...'
    if (statsError) return 'Error'
    if (!stats) return 'Loading...'
    
    switch (type) {
      case 'users': return formatNumber(stats.totalUsers)
      case 'sessions': return formatNumber(stats.totalChatSessions)
      case 'documents': return formatNumber(stats.totalDocumentRequests)
      case 'recent': return formatNumber(stats.recentUsers)
      default: return 'N/A'
    }
  }

  const handleRetryAuth = () => {
    clearAuthError()
    window.location.reload()
  }

  const handleGoToLogin = () => {
    clearAuthError()
    router.push('/login')
  }

  // Show loading while validating token
  if (isValidatingToken) {
    return <AuthLoading {...loadingContext} />
  }

  // Show loading while logging out
  if (isLoggingOut) {
    return <AuthLoading {...loadingContext} />
  }

  // Show auth error
  if (authError && authError.showToUser) {
    return (
      <AuthError 
        error={authError}
        onRetry={handleRetryAuth}
        onGoHome={handleGoToLogin}
        showRetry={authError.code === 'NETWORK_ERROR'}
      />
    )
  }

  // Show loading during explicit operations
  if (isLoading || isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Return null if not authenticated (redirect handled in useEffect)
  if (!isAuthenticated || !user) {
    return null
  }

  // Main admin page content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="mt-1 text-gray-600">Manage users and system settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-medium text-gray-900">{user.name || user.email}</span>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveSection('rate-limits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'rate-limits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rate Limits
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' && (
          <div>
            {/* Stats Header with Refresh Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
              <button
                onClick={fetchStats}
                disabled={statsLoading}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${statsLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{statsLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <AdminStatsCard title="Total Users" value={getCardValue('users')} color="blue" />
              <AdminStatsCard title="Chat Sessions" value={getCardValue('sessions')} color="green" />
              <AdminStatsCard title="Documents" value={getCardValue('documents')} color="purple" />
              <AdminStatsCard title="New Users (30d)" value={getCardValue('recent')} color="orange" />
            </div>

            {/* Show error message if stats failed to load */}
            {statsError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-800">{statsError}</span>
                  <button
                    onClick={fetchStats}
                    className="ml-auto px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Users Management */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Manage platform users and their permissions.</p>
                  <button 
                    onClick={() => setActiveSection('users')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View All Users
                  </button>
                </div>
              </div>

              {/* Rate Limits Management */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Rate Limits</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Configure feature usage limits.</p>
                  <button 
                    onClick={() => setActiveSection('rate-limits')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Manage Limits
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && (
          <AdminUsersList />
        )}

        {activeSection === 'rate-limits' && (
          <AdminRateLimits />
        )}
      </main>
    </div>
  )
}

// Stats Card Component
function AdminStatsCard({ title, value, color }: { title: string; value: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            color === 'blue' ? 'bg-blue-100' :
            color === 'green' ? 'bg-green-100' :
            color === 'purple' ? 'bg-purple-100' :
            'bg-orange-100'
          }`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium truncate">{title}</dt>
            <dd className="text-lg font-medium">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  )
}