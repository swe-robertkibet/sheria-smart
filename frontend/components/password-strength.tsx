"use client"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strength = getStrength(password)
  const getStrengthText = () => {
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Medium"
    if (strength <= 4) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    if (strength <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getTextColor = () => {
    if (strength <= 2) return "text-red-500"
    if (strength <= 3) return "text-yellow-600"
    if (strength <= 4) return "text-blue-500"
    return "text-green-500"
  }

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${getTextColor()}`}>{getStrengthText()}</span>
      </div>
      <div className="text-xs text-[#718096] space-y-1">
        <div className="flex flex-wrap gap-2">
          <span className={password.length >= 8 ? "text-green-600" : "text-gray-400"}>✓ 8+ characters</span>
          <span className={/[a-z]/.test(password) ? "text-green-600" : "text-gray-400"}>✓ lowercase</span>
          <span className={/[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"}>✓ uppercase</span>
          <span className={/[0-9]/.test(password) ? "text-green-600" : "text-gray-400"}>✓ number</span>
          <span className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-400"}>✓ special char</span>
        </div>
      </div>
    </div>
  )
}
