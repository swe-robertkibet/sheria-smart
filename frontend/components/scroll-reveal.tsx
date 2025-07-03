"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function ScrollReveal({ children, delay = 0, direction = "up", className = "" }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getTransformClass = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100"

    switch (direction) {
      case "up":
        return "translate-y-8 opacity-0"
      case "down":
        return "-translate-y-8 opacity-0"
      case "left":
        return "translate-x-8 opacity-0"
      case "right":
        return "-translate-x-8 opacity-0"
      default:
        return "translate-y-8 opacity-0"
    }
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${getTransformClass()} ${className}`}>
      {children}
    </div>
  )
}
