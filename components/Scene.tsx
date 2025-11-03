'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SceneProps {
  id: number
  background: string
  title: string
  subtitle: string
  mockupContent: string
  index: number
  isLast: boolean
  colorTint?: string
}

export default function Scene({ background, title, subtitle, index, isLast, colorTint }: SceneProps) {
  return (
    <div className={`scene-${index} relative flex-shrink-0 h-full`} style={{ width: '100vw' }}>
      {/* Background Image with Parallax */}
      <div className={`scene-bg-${index} absolute inset-0 w-[120%]`} style={{ willChange: 'transform' }}>
        <Image
          src={background}
          alt={title}
          fill
          className="object-cover"
          priority={index === 0}
          quality={90}
        />
        {/* Color Tint Layer for smooth transitions */}
        {colorTint && (
          <div 
            className="absolute inset-0 transition-opacity duration-1000" 
            style={{ backgroundColor: colorTint }}
          />
        )}
        {/* Darker Gradient Overlay for Better Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
      </div>

      {/* Content - Centered */}
      <div className={`scene-content-${index} relative z-10 h-full flex flex-col items-center justify-center px-8`} style={{ opacity: 1 }}>
        <div className="max-w-4xl space-y-8 text-center">
          <h2 className={`scene-title-${index} text-6xl md:text-8xl font-bold text-white leading-none drop-shadow-2xl font-[family-name:var(--font-space-grotesk)]`} style={{ letterSpacing: '-0.03em', opacity: 1 }}>
            {title}
          </h2>
          <p className={`scene-subtitle-${index} text-2xl md:text-3xl text-white/95 font-light drop-shadow-lg font-[family-name:var(--font-inter)]`} style={{ letterSpacing: '-0.01em', opacity: 1 }}>
            {subtitle}
          </p>
          
          {/* Logo */}
          <div className="flex justify-center pt-4">
            <Image
              src="/logo.png"
              alt="SeeMe Logo"
              width={120}
              height={120}
              className="drop-shadow-2xl"
            />
          </div>
        </div>

        {/* App Store Button (Last Scene) */}
        {isLast && (
          <div className="mt-16 pointer-events-auto">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:scale-105 transition-transform shadow-2xl font-[family-name:var(--font-inter)]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on App Store
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
