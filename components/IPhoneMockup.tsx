'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function IPhoneMockup() {
  const mockupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mockupRef.current) return

    // Subtle floating animation only
    gsap.to(mockupRef.current, {
      y: -15,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })
  }, [])

  return (
    <div ref={mockupRef} className="iphone-mockup relative opacity-90" style={{ perspective: '1000px' }}>
      {/* iPhone Frame - More subtle and modern */}
      <div className="relative w-[260px] h-[530px] md:w-[300px] md:h-[610px]">
        {/* iPhone Outline with glass effect */}
        <div className="absolute inset-0 rounded-[3rem] border-[10px] border-black/80 bg-black/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black/90 rounded-b-3xl z-10" />
          
          {/* Screen with subtle gradient */}
          <div className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-br from-pink-100/80 via-orange-100/80 to-purple-100/80 overflow-hidden backdrop-blur-md">
            {/* Screen Content Placeholder - Minimalist */}
            <div className="w-full h-full flex items-center justify-center p-8">
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-white/30 backdrop-blur-md border border-white/40" />
                <div className="space-y-3">
                  <div className="h-2 w-28 mx-auto bg-white/25 rounded-full" />
                  <div className="h-2 w-20 mx-auto bg-white/15 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Icons - More subtle and fewer */}
        <div className="absolute -top-10 -left-10 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-60">
          <div className="w-5 h-5 rounded-full bg-white/30" />
        </div>
        <div className="absolute -top-6 -right-14 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-60">
          <div className="w-6 h-6 rounded-full bg-white/30" />
        </div>
        <div className="absolute top-24 -right-16 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-60">
          <div className="w-5 h-5 rounded-full bg-white/30" />
        </div>
        <div className="absolute -bottom-6 -right-10 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-60">
          <div className="w-5 h-5 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  )
}
