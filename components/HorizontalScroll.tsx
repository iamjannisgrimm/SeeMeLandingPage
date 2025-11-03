'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Scene from './Scene'
import ScrollIndicator from './ScrollIndicator'
import CursorFollower from './CursorFollower'

gsap.registerPlugin(ScrollTrigger)

const scenes = [
  {
    id: 1,
    background: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountain sunrise
    title: 'Welcome to SeeMe',
    subtitle: 'Your personal network of support',
    mockupContent: 'hero',
    colorTint: 'rgba(59, 130, 246, 0.15)', // Blue tint
  },
  {
    id: 2,
    background: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1920&q=80', // Golden clouds
    title: 'AI-Powered Coaches',
    subtitle: 'Your partner for personal greatness',
    mockupContent: 'coaches',
    colorTint: 'rgba(251, 191, 36, 0.15)', // Amber tint
  },
  {
    id: 3,
    background: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80', // Autumn mist
    title: 'Completely Private',
    subtitle: 'Local AI keeps your data yours',
    mockupContent: 'privacy',
    colorTint: 'rgba(139, 92, 246, 0.15)', // Purple tint
  },
  {
    id: 4,
    background: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=1920&q=80', // Winter forest
    title: 'Track Your Growth',
    subtitle: 'Visualize your capacity and progress',
    mockupContent: 'dashboard',
    colorTint: 'rgba(34, 197, 94, 0.15)', // Green tint
  },
  {
    id: 5,
    background: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', // Spring lake
    title: 'Start Your Journey',
    subtitle: 'Available now on iOS',
    mockupContent: 'cta',
    colorTint: 'rgba(236, 72, 153, 0.15)', // Pink tint
  },
]

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const scrollContainer = scrollRef.current
    
    if (!container || !scrollContainer) return

    // Function to get scroll amount
    const getScrollAmount = () => {
      const scrollWidth = scrollContainer.scrollWidth
      return -(scrollWidth - window.innerWidth)
    }
    
    const ctx = gsap.context(() => {
      // HORIZONTAL SCROLL - Professional approach
      const horizontalTween = gsap.to(scrollContainer, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollContainer.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Animate each scene with DEPTH PARALLAX
      scenes.forEach((_, index) => {
        const scene = `.scene-${index}`
        const bg = `.scene-bg-${index}`
        
        // LAYER 1: Background - Slowest (0.3x speed) for depth
        gsap.to(bg, {
          x: -500,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'left right',
            end: 'right left',
            scrub: 3,
            containerAnimation: horizontalTween,
          },
        })
      })

      // iPhone mockup animations removed

      // Progress dots with magnetic feel
      scenes.forEach((_, index) => {
        const dot = `.progress-dot-${index}`
        
        gsap.to(dot, {
          scale: 1.8,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.6)',
          scrollTrigger: {
            trigger: `.scene-${index}`,
            start: 'left center',
            end: 'right center',
            scrub: 0.3,
            containerAnimation: horizontalTween,
          },
        })
      })
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden" suppressHydrationWarning>
      <div 
        ref={scrollRef} 
        className="flex h-full"
        style={{ width: `${scenes.length * 100}vw` }}
        suppressHydrationWarning
      >
        {scenes.map((scene, index) => (
          <Scene
            key={scene.id}
            {...scene}
            index={index}
            isLast={index === scenes.length - 1}
          />
        ))}
      </div>

      {/* iPhone Mockup removed - will add video later */}

      {/* Progress Dots - Modern minimal with animation */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {scenes.map((_, index) => (
          <div
            key={index}
            className={`progress-dot-${index} w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-sm transition-all duration-300 cursor-pointer hover:bg-white/80`}
          />
        ))}
      </div>

      {/* Logo - Modern clean */}
      <div className="fixed top-10 left-10 z-30">
        <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg font-[family-name:var(--font-space-grotesk)]">SeeMe</h1>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Custom Cursor */}
      <CursorFollower />
    </div>
  )
}
