'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Lottie from 'lottie-react'
import helloAnimation from '../public/Hello.json'

gsap.registerPlugin(ScrollTrigger)

// Journey from ground to moon - in order backg1 → backg6
const backgrounds = [
  '/backgrounds/backg1.png',    // Ground level - earthy tones with tree
  '/backgrounds/backg2.png',    // Rising up - transitional
  '/backgrounds/backg3.png',    // Blue sky - daytime
  '/backgrounds/backg4.png',    // Midday - bright
  '/backgrounds/backg5.jpg',    // Dusk - purple tones
  '/backgrounds/backg6.png'     // Night sky - final destination
]

// Text with emphasized words (will be highlighted with gradient)
const textSequence = [
  { text: "Your personal network of ", highlight: "support" },
  { text: "AI coaches that ", highlight: "truly understand", rest: " you" },
  { text: "Privacy ", highlight: "built into", rest: " every conversation" },
  { text: "Coaches that ", highlight: "collaborate", rest: " for your growth" },
  { text: "The future of ", highlight: "personal development" }
]

// Theme colors from your app
const themeColors = [
  { from: '#E57373', to: '#EF9A9A' }, // Coral/Pink
  { from: '#64B5F6', to: '#90CAF9' }, // Blue
  { from: '#81C784', to: '#A5D6A7' }, // Green
  { from: '#FFD54F', to: '#FFE082' }, // Yellow
  { from: '#BA68C8', to: '#CE93D8' }  // Purple
]

const coaches = [
  { id: 1, image: '/coaches/c1.png', position: 'top-20 left-20' },
  { id: 2, image: '/coaches/c2.png', position: 'top-32 right-32' },
  { id: 3, image: '/coaches/c3.png', position: 'bottom-40 left-32' },
  { id: 4, image: '/coaches/c4.png', position: 'bottom-32 right-20' },
  { id: 5, image: '/coaches/c5.png', position: 'top-1/2 left-12' },
  { id: 6, image: '/coaches/c6.png', position: 'top-1/2 right-12' }
]

export default function CinematicLanding() {
  const containerRef = useRef<HTMLDivElement>(null)
  const seeTextRef = useRef<HTMLDivElement>(null)
  const meTextRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const helloLottieRef = useRef<HTMLDivElement>(null)
  const lottieInstanceRef = useRef<any>(null)
  const downloadButtonRef = useRef<HTMLDivElement>(null)
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - everything centered
      gsap.set([seeTextRef.current, meTextRef.current], { 
        x: 0,
        opacity: 1
      })
      gsap.set(videoRef.current, { 
        opacity: 0,
        scale: 0.7,
        y: 100,
        visibility: 'hidden' // Completely hide video initially
      })

      // Set initial state for coaches
      gsap.set(coaches.map(c => `.coach-${c.id}`), {
        opacity: 0,
        scale: 0.8,
        y: 30
      })
      gsap.set(textRef.current, {
        opacity: 1,
        y: 0,
        scale: 1
      })
      gsap.set(helloLottieRef.current, {
        opacity: 0,
        scale: 0.9,
        visibility: 'hidden'
      })
      gsap.set(downloadButtonRef.current, {
        opacity: 0,
        y: 30
      })

      // Create the main timeline with ultra-smooth cinematic scroll
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Responsive to scroll - follows user input directly
          pin: '.fixed',
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress
            
            // Smoother background transition with easing
            // Cap at 90% to prevent going past last background
            const cappedProgress = Math.min(progress, 0.9)
            const bgIndex = Math.floor(cappedProgress * (backgrounds.length - 1))
            const nextBgIndex = Math.min(bgIndex + 1, backgrounds.length - 1)
            
            if (backgroundRef.current) {
              const currentBg = backgroundRef.current.querySelector(`[data-bg="${bgIndex}"]`) as HTMLElement
              const nextBg = backgroundRef.current.querySelector(`[data-bg="${nextBgIndex}"]`) as HTMLElement
              
              if (currentBg && nextBg) {
                // Smooth eased transition between backgrounds
                const bgProgress = (cappedProgress * (backgrounds.length - 1)) - bgIndex
                const easedProgress = gsap.parseEase('power2.inOut')(bgProgress)
                gsap.set(currentBg, { opacity: 1 - easedProgress })
                gsap.set(nextBg, { opacity: easedProgress })
              }
            }
            
            // Keep last background visible at 100%
            if (progress > 0.9) {
              const lastBg = backgroundRef.current?.querySelector(`[data-bg="${backgrounds.length - 1}"]`) as HTMLElement
              if (lastBg) {
                gsap.set(lastBg, { opacity: 1 })
              }
            }
          }
        }
      })

      // Phase 1: Text splitting animation (0% - 35%) - ultra smooth and cinematic
      mainTimeline
        .to(logoRef.current, {
          opacity: 0,
          scale: 0.5,
          duration: 0.8, // Slower for cinematic feel
          ease: 'power2.inOut'
        })
        .to(seeTextRef.current, {
          x: -300,
          rotation: -2, // Minimal rotation
          duration: 0.8, // Slower
          ease: 'power2.out'
        }, '<')
        .to(meTextRef.current, {
          x: 300,
          rotation: 2, // Minimal rotation
          duration: 0.8, // Slower
          ease: 'power2.out'
        }, '<')
        .to(placeholderRef.current, {
          opacity: 0,
          scale: 0.85, // Less dramatic
          y: 20, // Minimal movement
          rotation: 3, // Minimal rotation
          duration: 0.7, // Slower
          ease: 'power2.inOut'
        }, '<+0.15')
        // Start video reveal with slight delay for smoother effect
        .set(videoRef.current, { visibility: 'visible', autoAlpha: 1 }, '<+0.2')
        .to(videoRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 2, // Slower, more gradual reveal
          ease: 'power3.out' // Smoother easing curve
        }, '<')

      // Phase 2: Video stays visible (35% - 60%)

      // Phase 3: Coaches appear (60% - 80%) - ultra smooth cascade
      coaches.forEach((coach, index) => {
        const coachElement = `.coach-${coach.id}`
        mainTimeline.to(coachElement, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9, // Much slower, more cinematic reveal
          ease: 'power2.out',
          stagger: 0.15 // More spacing between reveals
        }, `>-${0.2 - index * 0.04}`) // More overlap for ultra-smooth cascade

        // Add subtle floating animation to each coach - ultra gentle
        gsap.to(coachElement, {
          y: '+=10', // Minimal movement
          duration: 4 + index * 0.5, // Very slow float
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.4
        })
      })

      // Phase 4: Text cycling (80% - 85%)
      mainTimeline
        .to({}, { duration: 0.15 }) // Hold for text cycling

      // Phase 5: Hello Lottie animation reveal (85% - 95%) - plays when reaching backg5.jpg
      mainTimeline
        .to(videoRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: 'power2.inOut'
        })
        .to(textRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: 'power2.inOut'
        }, '<')
        .to(coaches.map(c => `.coach-${c.id}`), {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: 'power2.inOut'
        }, '<')
        .to(helloLottieRef.current, {
          visibility: 'visible',
          autoAlpha: 1,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.inOut',
          onStart: () => {
            // Play Lottie animation when scrolling forward
            if (lottieInstanceRef.current) {
              lottieInstanceRef.current.goToAndPlay(0)
            }
          },
          onReverseComplete: () => {
            // Stop Lottie animation when scrolling back
            if (lottieInstanceRef.current) {
              lottieInstanceRef.current.stop()
            }
          }
        })

      // Phase 6: Download button reveal (95% - 100%)
      mainTimeline
        .to(downloadButtonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.inOut' // Changed for smooth reverse
        })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Text cycling effect - starts after video reveals (slower, calmer)
  useEffect(() => {
    let interval: NodeJS.Timeout
    
    const startCycling = () => {
      interval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % textSequence.length)
      }, 4000) // Increased from 2500ms to 4000ms for calmer pace
    }

    // Delay start until video phase
    const timeout = setTimeout(startCycling, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // Text animation when index changes - ultra smooth infinite loop
  useEffect(() => {
    if (!textRef.current) return
    
    // Skip animation on first render
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }

    // Just fade in the new text (fade out happens before index changes)
    gsap.fromTo(textRef.current, 
      { 
        opacity: 0,
        scale: 0.98
      },
      { 
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out'
      }
    )
  }, [currentTextIndex, isFirstRender])

  return (
    <div ref={containerRef} className="h-[1000vh] w-full relative">
      {/* Fixed viewport container */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden snap-y snap-mandatory">
        {/* Dynamic Backgrounds */}
        <div ref={backgroundRef} className="absolute inset-0 z-0">
        {backgrounds.map((bg, index) => (
          <div
            key={`bg-${index}`}
            data-bg={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: index === 0 ? 1 : 0
            }}
          />
        ))}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Subtle gradient overlay for cinematic feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      {/* Early Access Badge - Top Right */}
      <div className="fixed top-8 right-8 z-50">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
          <Image
            src="/logo.png"
            alt="SeeMe Logo"
            width={32}
            height={32}
            className="drop-shadow-lg"
          />
          <span className="text-white font-semibold text-sm tracking-wide">Early Access</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {/* SeeMe Text with Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <div 
                ref={seeTextRef}
                className="text-8xl lg:text-9xl font-bold text-white font-[family-name:var(--font-space-grotesk)] tracking-tight drop-shadow-2xl"
              >
                See
              </div>
              <div 
                ref={meTextRef}
                className="text-8xl lg:text-9xl font-bold text-white font-[family-name:var(--font-space-grotesk)] tracking-tight drop-shadow-2xl"
              >
                Me
              </div>
            </div>
            
            {/* Logo below text */}
            <div ref={logoRef}>
              <Image
                src="/logo.png"
                alt="SeeMe Logo"
                width={100}
                height={100}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Your Dashboard Mockup (initially on right) */}
        <div ref={placeholderRef} className="absolute right-20 top-1/2 transform -translate-y-1/2">
          {/* Replace '/mockup-placeholder.png' with your actual mockup image path */}
          <div className="relative w-72 h-[600px]">
            <Image
              src="/mockup-placeholder.png"
              alt="SeeMe Dashboard"
              width={288}
              height={600}
              className="rounded-[3rem] shadow-2xl object-cover"
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none'
                const parent = e.currentTarget.parentElement
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-72 h-[600px] bg-white/10 backdrop-blur-md rounded-[3rem] border-2 border-white/20 shadow-2xl flex items-center justify-center">
                      <div class="text-center text-white/60 p-8">
                        <div class="text-6xl mb-4">📱</div>
                        <div class="text-sm font-medium">Add your mockup</div>
                        <div class="text-xs mt-2 opacity-60">Place image at /public/mockup-placeholder.png</div>
                      </div>
                    </div>
                  `
                }
              }}
            />
          </div>
        </div>

        {/* Demo Video (appears in center) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-3xl rounded-3xl shadow-2xl border-4 border-white/20 invisible pointer-events-none"
              playsInline
              loop
              muted
              autoPlay
              onLoadedData={() => setVideoLoaded(true)}
              style={{ visibility: 'hidden' }}
            >
              <source src="/Demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video loading indicator */}
            {!videoLoaded && (
              <div className="absolute inset-0 bg-slate-900 rounded-[3rem] flex items-center justify-center invisible" style={{ visibility: 'hidden' }}>
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <div className="text-sm">Loading demo...</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coach Avatars - appear around the scene */}
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className={`coach-${coach.id} absolute ${coach.position} z-20`}
          >
            <div className="relative group cursor-pointer">
              {/* Pulse ring effect */}
              <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" style={{ animationDuration: '3s' }} />
              
              <Image
                src={coach.image}
                alt={`Coach ${coach.id}`}
                width={80}
                height={80}
                className="rounded-full shadow-2xl border-4 border-white/30 backdrop-blur-sm transition-transform group-hover:scale-110 relative z-10"
              />
              
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all" />
            </div>
          </div>
        ))}

        {/* Cycling Text - Temporarily Hidden */}
        <div className="absolute bottom-56 left-1/2 transform -translate-x-1/2 text-center w-full px-8 hidden">
          <div className="relative">
            {/* Glow effect behind text */}
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
            
            <div 
              ref={textRef}
              className="relative text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl max-w-5xl mx-auto leading-tight font-[family-name:var(--font-space-grotesk)]"
            >
              {textSequence[currentTextIndex].text}
              <span 
                className="relative inline-block font-extrabold"
                style={{
                  backgroundImage: `linear-gradient(120deg, ${themeColors[currentTextIndex].from} 0%, ${themeColors[currentTextIndex].to} 50%, #ffffff 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 30px ${themeColors[currentTextIndex].from}80`,
                  letterSpacing: '0.02em'
                }}
              >
                {textSequence[currentTextIndex].highlight}
              </span>
              {textSequence[currentTextIndex].rest || ''}
            </div>
          </div>
        </div>

        {/* Hello Lottie Animation (Final Animation - plays when reaching backg5.jpg) */}
        <div 
          ref={helloLottieRef}
          className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center overflow-hidden"
          style={{ visibility: 'hidden' }}
        >
          <Lottie
            lottieRef={lottieInstanceRef}
            animationData={helloAnimation}
            loop={true}
            autoplay={false}
            style={{
              width: '120%',
              height: '120%',
              transform: 'scale(1.1)'
            }}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice'
            }}
          />
        </div>

        {/* App Store Button (appears after Hello animation) */}
        <div ref={downloadButtonRef} className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <button className="bg-white/90 backdrop-blur-sm text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:bg-white transition-all duration-300 shadow-2xl flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
            </svg>
            Download on App Store
          </button>
        </div>
      </div>


        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 z-20">
          <div className="text-white/60 text-sm">Scroll to explore</div>
        </div>
      </div>
    </div>
  )
}
