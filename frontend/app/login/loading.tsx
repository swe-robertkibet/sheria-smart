import { Loader2 } from "lucide-react"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-[#FEFCF3] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#7C9885] mb-4" />
        <p className="text-sm text-[#718096]">Loading login page...</p>
      </div>
    </div>
  )
}