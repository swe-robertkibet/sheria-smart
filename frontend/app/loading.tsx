export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#FEFCF3] flex flex-col">
      {/* Header Skeleton */}
      <div className="fixed top-0 w-full z-50 bg-[#FEFCF3]/90 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Skeleton */}
            <div className="flex items-center space-x-3">
              <div className="h-6 w-6 bg-[#7C9885] rounded animate-pulse"></div>
              <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
            </div>

            {/* Desktop Navigation Skeleton */}
            <div className="hidden md:flex items-center space-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              ))}
            </div>

            {/* Auth Buttons Skeleton */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="h-10 w-20 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-28 bg-[#7C9885] rounded animate-pulse"></div>
            </div>

            {/* Mobile Menu Skeleton */}
            <div className="md:hidden">
              <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-6 py-20">
          {/* Hero Section Skeleton */}
          <div className="grid lg:grid-cols-5 gap-12 items-center mb-20">
            <div className="lg:col-span-3 space-y-8">
              {/* Title Skeleton */}
              <div className="space-y-4">
                <div className="h-16 bg-gray-300 rounded animate-pulse mb-4"></div>
                <div className="h-8 w-3/4 bg-[#7C9885] opacity-30 rounded animate-pulse mb-4"></div>
                <div className="h-6 w-2/3 bg-gray-300 rounded animate-pulse"></div>
              </div>
              
              {/* Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="h-14 w-40 bg-gradient-to-r from-[#7C9885] to-[#5D7A6B] rounded-xl animate-pulse"></div>
                <div className="h-14 w-48 border-2 border-[#C99383] rounded-xl animate-pulse"></div>
              </div>
            </div>

            {/* Hero Card Skeleton */}
            <div className="lg:col-span-2">
              <div className="relative w-full flex justify-center items-center py-16 px-8">
                <div className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-3xl p-8 transform rotate-3 w-full max-w-sm animate-pulse">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3 h-12"></div>
                      <div className="bg-white/20 rounded-lg p-3 h-12 ml-4"></div>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section Skeleton */}
          <div className="grid lg:grid-cols-12 gap-8 mb-20">
            {/* Large Feature Card */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-3xl p-8 h-80 animate-pulse">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl"></div>
                  <div className="h-8 w-3/4 bg-white/20 rounded"></div>
                  <div className="h-6 bg-white/10 rounded"></div>
                  <div className="h-6 w-2/3 bg-white/10 rounded"></div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="bg-white/20 px-3 py-1 rounded-full w-20 h-6"></div>
                    <div className="bg-white/20 px-3 py-1 rounded-full w-24 h-6"></div>
                    <div className="bg-white/20 px-3 py-1 rounded-full w-28 h-6"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              {/* Small Feature Cards */}
              <div className="bg-gradient-to-br from-[#C99383] to-[#B8826F] rounded-3xl p-6 h-40 animate-pulse">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
                  <div className="h-6 w-3/4 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/10 rounded"></div>
                  <div className="h-4 w-2/3 bg-white/10 rounded"></div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#F7DC6F] to-[#F4D03F] rounded-3xl p-6 h-40 animate-pulse">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-[#2D3748]/10 rounded-xl"></div>
                  <div className="h-6 w-3/4 bg-[#2D3748]/10 rounded"></div>
                  <div className="h-4 bg-[#2D3748]/10 rounded"></div>
                  <div className="h-4 w-2/3 bg-[#2D3748]/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="bg-[#2D3748] py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-32 bg-gray-600 rounded animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-[#4A5568] pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="h-4 w-48 bg-gray-600 rounded animate-pulse"></div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-gray-600 rounded-full animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}