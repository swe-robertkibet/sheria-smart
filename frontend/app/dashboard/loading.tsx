export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FEFCF3]">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-[#7C9885] rounded animate-skeleton-pulse"></div>
            <div className="h-6 w-32 skeleton-loading"></div>
          </div>

          {/* Navigation Pills Skeleton */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-10 w-24 skeleton-loading rounded-full"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>

          {/* User Menu Skeleton */}
          <div className="flex items-center space-x-4">
            <div className="h-10 w-20 skeleton-loading rounded-lg"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full animate-skeleton-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Section Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 w-80 mx-auto skeleton-loading rounded-lg mb-4"></div>
          <div className="h-6 w-64 mx-auto skeleton-loading rounded"></div>
        </div>

        {/* Three Main Action Cards Skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Quick Chat Card Skeleton */}
          <div className="group">
            <div className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-2xl p-8 h-80 animate-fade-in"
                 style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-col justify-between h-full text-center">
                {/* Icon and content */}
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto animate-skeleton-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-8 w-32 bg-white/20 rounded mx-auto"></div>
                    <div className="h-5 bg-white/10 rounded mx-auto"></div>
                    <div className="h-5 w-3/4 bg-white/10 rounded mx-auto"></div>
                  </div>
                </div>
                
                {/* Button skeleton */}
                <div className="h-12 w-32 bg-white/30 rounded-lg mx-auto animate-skeleton-pulse"></div>
              </div>
            </div>
          </div>

          {/* Legal Analysis Card Skeleton */}
          <div className="group">
            <div className="bg-gradient-to-br from-[#C99383] to-[#B8826F] rounded-2xl p-8 h-80 animate-fade-in"
                 style={{ animationDelay: '0.2s' }}>
              <div className="flex flex-col justify-between h-full text-center">
                {/* Icon and content */}
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full mx-auto animate-skeleton-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-8 w-36 bg-white/20 rounded mx-auto"></div>
                    <div className="h-5 bg-white/10 rounded mx-auto"></div>
                    <div className="h-5 w-3/4 bg-white/10 rounded mx-auto"></div>
                  </div>
                </div>
                
                {/* Button skeleton */}
                <div className="h-12 w-36 bg-white/30 rounded-lg mx-auto animate-skeleton-pulse"></div>
              </div>
            </div>
          </div>

          {/* Documents Card Skeleton */}
          <div className="group">
            <div className="bg-gradient-to-br from-[#F7DC6F] to-[#F4D03F] rounded-2xl p-8 h-80 animate-fade-in"
                 style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col justify-between h-full text-center">
                {/* Icon and content */}
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-[#2D3748]/10 rounded-full mx-auto animate-skeleton-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-8 w-28 bg-[#2D3748]/10 rounded mx-auto"></div>
                    <div className="h-5 bg-[#2D3748]/10 rounded mx-auto"></div>
                    <div className="h-5 w-3/4 bg-[#2D3748]/10 rounded mx-auto"></div>
                  </div>
                </div>
                
                {/* Button skeleton */}
                <div className="h-12 w-40 bg-[#2D3748]/20 rounded-lg mx-auto animate-skeleton-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content Skeleton */}
        <div className="space-y-8">
          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="h-7 w-40 skeleton-loading rounded"></div>
              <div className="h-9 w-24 skeleton-loading rounded-lg"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
                     style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                  <div className="w-12 h-12 skeleton-loading rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 skeleton-loading rounded"></div>
                    <div className="h-4 w-1/2 skeleton-loading rounded"></div>
                  </div>
                  <div className="h-4 w-16 skeleton-loading rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-fade-in"
                   style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-24 skeleton-loading rounded"></div>
                  <div className="w-8 h-8 skeleton-loading rounded-lg"></div>
                </div>
                <div className="h-8 w-16 skeleton-loading rounded mb-2"></div>
                <div className="h-4 w-20 skeleton-loading rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Loading overlay with logo */}
      <div className="fixed inset-0 bg-[#FEFCF3]/80 backdrop-blur-sm flex items-center justify-center pointer-events-none z-50">
        <div className="text-center">
          <div className="relative">
            {/* Spinning ring */}
            <div className="w-16 h-16 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin-slow mx-auto mb-4"></div>
            {/* Inner logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#7C9885] rounded animate-skeleton-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-5 w-32 skeleton-loading rounded mx-auto"></div>
            <div className="h-4 w-24 skeleton-loading rounded mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}