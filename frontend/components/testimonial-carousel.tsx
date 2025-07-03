"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

const testimonials = [
  {
    initial: "M.K.",
    text: "Saved me hours on my tenancy agreement!",
    rating: 5,
  },
  {
    initial: "J.W.",
    text: "Finally understand my employment rights.",
    rating: 5,
  },
  {
    initial: "A.N.",
    text: "Professional legal documents in minutes.",
    rating: 5,
  },
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const current = testimonials[currentIndex]

  return (
    <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-500">
      <div className="space-y-3">
        <div className="flex space-x-1">
          {[...Array(current.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F7DC6F] text-[#F7DC6F]" />
          ))}
        </div>
        <p className="text-white/90 italic">"{current.text}"</p>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#F7DC6F] rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-[#2D3748]">{current.initial}</span>
          </div>
          <span className="text-sm text-white/70">Verified User</span>
        </div>
      </div>
    </div>
  )
}
