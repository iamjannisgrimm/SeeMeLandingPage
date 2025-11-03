'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const scenes = [
  {
    title: 'SeeMe',
    subtitle: 'Your personal network of support',
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
  },
  {
    title: 'AI Coaches',
    subtitle: 'Always there when you need them',
    background: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1920&q=80',
  },
  {
    title: 'Completely Private',
    subtitle: 'Your data stays on your device',
    background: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1920&q=80',
  },
]

export default function SmoothScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sections = gsap.utils.toArray('.section')
    
    // Smooth scroll with momentum
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.5, // Lower = more responsive, smoother
        snap: 1 / (sections.length - 1),
        end: () => `+=${containerRef.current!.offsetWidth * sections.length}`,
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={containerRef} className="h-screen overflow-hidden">
      <div className="flex h-full w-[300vw]">
        {scenes.map((scene, i) => (
          <section
            key={i}
            className="section relative w-screen h-full flex-shrink-0 flex items-center justify-center"
            style={{
              backgroundImage: `url(${scene.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 text-center px-8 max-w-4xl">
              <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold text-white mb-6 tracking-tight font-[family-name:var(--font-space-grotesk)]">
                {scene.title}
              </h1>
              <p className="text-[clamp(1.25rem,3vw,2rem)] text-white/90 font-light font-[family-name:var(--font-inter)]">
                {scene.subtitle}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
