"use client"

import { Scale, FileText, MessageCircle, Shield, Gavel, BookOpen } from "lucide-react"

export function FloatingIcons() {
  const icons = [
    { Icon: Scale, delay: "0s", position: "top-16 left-4", size: "w-6 h-6" },
    { Icon: FileText, delay: "1s", position: "top-32 right-8", size: "w-5 h-5" },
    { Icon: MessageCircle, delay: "2s", position: "top-48 left-8", size: "w-7 h-7" },
    { Icon: Shield, delay: "0.5s", position: "bottom-32 right-4", size: "w-6 h-6" },
    { Icon: Gavel, delay: "1.5s", position: "bottom-48 left-8", size: "w-5 h-5" },
    { Icon: BookOpen, delay: "2.5s", position: "top-64 right-12", size: "w-6 h-6" },
  ]

  return (
    <div className="absolute inset-4 overflow-hidden">
      {icons.map(({ Icon, delay, position, size }, index) => (
        <div key={index} className={`absolute ${position} animate-float opacity-30`} style={{ animationDelay: delay }}>
          <Icon className={`${size} text-white`} />
        </div>
      ))}
    </div>
  )
}
