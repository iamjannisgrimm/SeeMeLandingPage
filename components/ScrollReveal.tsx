'use client'

import { useEffect, useRef, ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

export default function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = ''
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const ctx = gsap.context(() => {
      const directionMap = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 }
      }

      const { x, y } = directionMap[direction]

      gsap.fromTo(element, 
        {
          opacity: 0,
          x,
          y,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom-=100',
            end: 'bottom top',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, element)

    return () => ctx.revert()
  }, [direction, delay])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
