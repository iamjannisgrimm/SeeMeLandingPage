'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const cursor = cursorRef.current
    const follower = followerRef.current
    
    if (!cursor || !follower) return

    // Only show on desktop
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      })

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseEnter = () => {
      gsap.to([cursor, follower], {
        scale: 1.5,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const handleMouseLeave = () => {
      gsap.to([cursor, follower], {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', moveCursor)

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cursor-hover')
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [isMounted])

  if (!isMounted) return null

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Follower circle */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  )
}
