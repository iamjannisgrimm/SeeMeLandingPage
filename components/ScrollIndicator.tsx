'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ScrollIndicator() {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pulse animation
    gsap.to(indicatorRef.current, {
      opacity: 0.3,
      scale: 1.2,
      duration: 1.5,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Fade out after 3 seconds
    gsap.to(indicatorRef.current, {
      opacity: 0,
      delay: 3,
      duration: 1,
    })
  }, [])

  return (
    <div 
      ref={indicatorRef}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
    >
      <p className="text-white/70 text-sm font-light tracking-widest uppercase font-[family-name:var(--font-inter)]">Scroll</p>
      <svg 
        className="w-6 h-6 text-white/70" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5l7 7-7 7" 
        />
      </svg>
    </div>
  )
}
