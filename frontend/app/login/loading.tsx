export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#FEFCF3] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-[#718096]">Loading...</p>
      </div>
    </div>
  )
}