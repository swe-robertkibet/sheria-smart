export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#FEFCF3] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Enhanced loading animation */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto relative">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin-slow"></div>
            
            {/* Inner logo area */}
            <div className="absolute inset-2 bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-full flex items-center justify-center animate-skeleton-pulse">
              <div className="text-white font-bold text-sm">S</div>
            </div>
          </div>
        </div>

        {/* Loading message */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-[#2D3748] animate-fade-in">Sheria Smart</h2>
          <p className="text-sm text-[#718096] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Loading login page...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#C99383] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-[#F7DC6F] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}