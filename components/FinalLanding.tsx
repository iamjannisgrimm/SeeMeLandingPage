'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { videoUrls } from '../config/videoUrls';
import SmartVideo, { preloadVideosSequentially } from './SmartVideo';

gsap.registerPlugin(ScrollTrigger);

const backgrounds = [
  '/backgrounds/backg1.png',
  '/backgrounds/backg2.png',
  '/backgrounds/backg2.png',
  '/backgrounds/backg3.png',
  '/backgrounds/backg3.png',
  '/backgrounds/backg4.png',
  '/backgrounds/backg5.png',
  '/backgrounds/backg6.png',
  '/backgrounds/backg6.png', // CTA uses same background as section 8
];

const FinalLanding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Section Refs
  const heroRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
  const section8Ref = useRef<HTMLDivElement>(null);
  const section9Ref = useRef<HTMLDivElement>(null);

  const riseSpanRef = useRef<HTMLSpanElement>(null);
  const riseTextRef = useRef<HTMLParagraphElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [currentNotification, setCurrentNotification] = useState(1);

  // Preload images first (critical for initial render)
  useEffect(() => {
    const imagesToPreload = [
      ...backgrounds,
      '/coaches/c1.png',
      '/coaches/c2.png',
      '/coaches/c3.png',
      '/coaches/c4.png',
      '/coaches/c5.png',
      '/coaches/c6.png',
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    // Shorter minimum time - just enough to prevent flash
    const minDisplayTime = setTimeout(() => {
      // After 1.5s, show content even if not everything is loaded
      setImagesLoaded(true);
    }, 1500);

    imagesToPreload.forEach((src) => {
      const img = new window.Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.src = src;
    });

    return () => clearTimeout(minDisplayTime);
  }, []);

  // Preload videos progressively AFTER images are loaded
  // Hero video first, then others in background
  useEffect(() => {
    if (!imagesLoaded) return;

    // Start preloading videos in the background
    // Hero video (video1) gets priority, others load sequentially
    preloadVideosSequentially(
      [videoUrls.video1], // Priority: hero video
      [videoUrls.video2, videoUrls.video3, videoUrls.video4, videoUrls.video5, videoUrls.video6] // Others
    );
  }, [imagesLoaded]);

  // Cycle through notification groups when in section 5
  useEffect(() => {
    if (activeSection === 5) {
      const interval = setInterval(() => {
        setCurrentNotification(prev => prev === 1 ? 2 : 1); // Toggle between group 1 and 2
      }, 8000); // Change notification every 8 seconds (longer stay)

      return () => clearInterval(interval);
    }
  }, [activeSection]);

  // Smooth background transitions and Section animations with GSAP
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        snap: {
          snapTo: (progress) => {
            // Don't snap at the very start (prevents auto-scroll on load)
            if (progress < 0.02) {
              return 0;
            }
            
            // Get current scroll velocity
            const velocity = Math.abs(ScrollTrigger.getById('main-scroll')?.getVelocity() || 0);

            // If scrolling fast, don't snap - let user fly through
            if (velocity > 200) {
              return progress; // Return current progress, no snapping
            }

            // If scrolling slowly or stopped, snap to CENTER of each section
            // Section centers: 0.5/9, 1.5/9, 2.5/9, etc.
            const snapPoints = [
              0,       // Stay at top if near top
              1.5/9,   // Section 2 center
              2.5/9,   // Section 3 center
              3.5/9,   // Section 4 center
              4.5/9,   // Section 5 center
              5.5/9,   // Section 6 center
              6.5/9,   // Section 7 center
              7.5/9,   // Section 8 center
              1,       // Section 9 (CTA) - snap to end
            ];
            const closest = snapPoints.reduce((prev, curr) =>
              Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
            );

            // Only snap if we're reasonably close to a section center
            const distance = Math.abs(closest - progress);
            return distance < 0.1 ? closest : progress;
          },
          duration: { min: 0.6, max: 1.4 },
          delay: 0.5, // Longer delay to prevent snap on load
          ease: "power2.inOut"
        },
        id: 'main-scroll', // Give it an ID so we can reference it for velocity
        onUpdate: (self) => {
          const progress = self.progress;

          // Update Active Section (0-7) for conditional rendering of heavy components
          // We use a slight buffer to ensure we don't flicker at boundaries
          const newSection = Math.min(Math.floor(progress * 9), 8);
          setActiveSection((prev) => (prev !== newSection ? newSection : prev));

          // Debug log for section 5 (rise section)
          if (newSection === 5) {
            console.log('Section 5 active - checking text opacity');
            if (riseTextRef.current) {
              const style = window.getComputedStyle(riseTextRef.current);
              const opacity = style.opacity;
              const transform = style.transform;
              console.log('Text debug - opacity:', opacity, 'transform:', transform);
            }
          }

          // --- Background Logic ---
          const exactBgIndex = progress * (backgrounds.length - 1);
          const bgIndex = Math.floor(exactBgIndex);
          const nextBgIndex = Math.min(bgIndex + 1, backgrounds.length - 1);

          if (backgroundRef.current) {
            backgrounds.forEach((_, index) => {
              const bg = backgroundRef.current!.querySelector(`[data-bg="${index}"]`) as HTMLElement;
              if (bg) gsap.set(bg, { opacity: 0 });
            });

            const currentBg = backgroundRef.current.querySelector(`[data-bg="${bgIndex}"]`) as HTMLElement;
            const nextBg = backgroundRef.current.querySelector(`[data-bg="${nextBgIndex}"]`) as HTMLElement;

            if (currentBg && nextBg && bgIndex !== nextBgIndex) {
              const bgProgress = exactBgIndex - bgIndex;
              const delayedStart = 0.20;
              const delayedEnd = 0.80;
              const transitionWindow = delayedEnd - delayedStart;

              let adjustedProgress = 0;
              if (bgProgress < delayedStart) {
                adjustedProgress = 0;
              } else if (bgProgress > delayedEnd) {
                adjustedProgress = 1;
              } else {
                const normalizedProgress = (bgProgress - delayedStart) / transitionWindow;
                adjustedProgress = gsap.parseEase('power1.inOut')(normalizedProgress);
              }

              gsap.set(currentBg, { opacity: 1 - adjustedProgress });
              gsap.set(nextBg, { opacity: adjustedProgress });
            } else if (currentBg) {
              gsap.set(currentBg, { opacity: 1 });
            }
          }

          // --- Helper Functions for Section Animations ---
          const getSectionOpacity = (sectionStart: number, sectionEnd: number) => {
            if (progress < sectionStart || progress >= sectionEnd) return 0;

            const sectionDuration = sectionEnd - sectionStart;
            const fadeInEnd = sectionStart + sectionDuration * 0.1;
            const fadeOutStart = sectionEnd - sectionDuration * 0.1;

            if (progress < fadeInEnd) {
              return gsap.utils.mapRange(sectionStart, fadeInEnd, 0, 1, progress);
            } else if (progress > fadeOutStart) {
              return 1 - gsap.utils.mapRange(fadeOutStart, sectionEnd, 0, 1, progress);
            }
            return 1;
          };

          // --- Apply Animations to Sections ---

          // Section 1: Hero (0 - 1/9)
          if (heroRef.current) {
            // Custom logic for Hero from original: fade out only
            const opacity = progress <= 1 / 9 ? (progress < 0.07 ? 1 : 1 - gsap.utils.mapRange(0.07, 1 / 9, 0, 1, progress)) : 0;
            heroRef.current.style.opacity = String(opacity);
            heroRef.current.style.pointerEvents = progress < 1 / 9 ? 'auto' : 'none';
          }

          // Section 2: Network (1/9 - 2/9)
          if (section2Ref.current) {
            const start = 1 / 9, end = 2 / 9;
            const opacity = getSectionOpacity(start, end);
            section2Ref.current.style.opacity = String(opacity);
            section2Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // Transform logic for text content (first child)
            const textContent = section2Ref.current.querySelector('.text-content') as HTMLElement;
            if (textContent) {
              textContent.style.transform = progress >= start && progress < end ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.95)';
            }
          }

          // Section 3: Understanding (2/9 - 3/9)
          if (section3Ref.current) {
            const start = 2 / 9, end = 3 / 9;
            section3Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section3Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section3Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section3Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section3Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 4: Insights (3/9 - 4/9)
          if (section4Ref.current) {
            const start = 3 / 9, end = 4 / 9;
            section4Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section4Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section4Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section4Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section4Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 5: Strategies (4/9 - 5/9)
          if (section5Ref.current) {
            const start = 4 / 9, end = 5 / 9;
            section5Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section5Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            const leftCol = section5Ref.current.querySelector('.left-col') as HTMLElement;
            const rightCol = section5Ref.current.querySelector('.right-col') as HTMLElement;
            const centerVideo = section5Ref.current.querySelector('.center-video') as HTMLElement;

            const isActive = progress >= start && progress < end;
            if (leftCol) leftCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)';
            if (rightCol) rightCol.style.transform = isActive ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)';
            if (centerVideo) centerVideo.style.transform = isActive ? 'scale(1)' : 'scale(0.9)';
          }

          // Section 6: Rise (5/9 - 6/9)
          if (section6Ref.current) {
            const start = 5 / 9, end = 6 / 9;
            section6Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section6Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // Special logic for the "daily guidance" span
            if (riseSpanRef.current) {
              const spanStart = 5 / 9;
              const spanEnd = 5.5 / 9; // Finishes earlier to stay longer
              let spanOpacity = 0;
              let spanY = 200;

              if (progress >= spanStart && progress < end) {
                const p = Math.min(progress, spanEnd);
                spanOpacity = gsap.utils.mapRange(spanStart, spanEnd, 0, 1, p);
                spanY = gsap.utils.mapRange(spanStart, spanEnd, 200, 0, p);
              } else if (progress >= end) {
                spanOpacity = 0;
                spanY = 0;
              }

              riseSpanRef.current.style.opacity = String(spanOpacity);
              riseSpanRef.current.style.transform = `translateY(${spanY}px)`;
            }

            // Keep text paragraph static and fully visible
            if (riseTextRef.current) {
              riseTextRef.current.style.opacity = "1";
              riseTextRef.current.style.transform = "translateY(0px)";
            }
          }

          // Section 7: Reviews (6/9 - 7/9)
          if (section7Ref.current) {
            const start = 6 / 9, end = 7 / 9;
            section7Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section7Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // The paragraph inside reviews has specific opacity logic
            const pText = section7Ref.current.querySelector('.reviews-text') as HTMLElement;
            if (pText) {
              const pVal = progress >= start && progress < end
                ? gsap.utils.mapRange(start, start + 0.1, 0, 1, Math.min(progress, start + 0.1))
                : 0;
              pText.style.opacity = String(pVal);
            }
          }

          // Section 8: Privacy (7/9 - 8/9)
          if (section8Ref.current) {
            const start = 7 / 9, end = 8 / 9;
            section8Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section8Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';
          }

          // Section 9: CTA (8/9 - 1) - stays visible at end
          if (section9Ref.current) {
            const start = 8 / 9;
            const isActive = progress >= start;
            
            // Fade in and STAY fully visible (no fade out)
            let opacity = 0;
            if (isActive) {
              // Quick fade in, then stay at 1
              opacity = Math.min((progress - start) * 18, 1); // Faster fade in
            }
            
            section9Ref.current.style.opacity = String(opacity);
            section9Ref.current.style.pointerEvents = isActive ? 'auto' : 'none';
            
            // Animate the content - settle into final position
            const ctaInner = section9Ref.current.querySelector('.cta-inner') as HTMLElement;
            if (ctaInner) {
              const animProgress = Math.min((progress - start) * 18, 1);
              const scale = 0.95 + 0.05 * animProgress;
              const y = 30 - 30 * animProgress;
              ctaInner.style.transform = `translateY(${y}px) scale(${scale})`;
            }
          }
        }
      });
    });

    return () => ctx.revert();
  }, [imagesLoaded]);

  const coaches = [
    { id: 1, img: '/coaches/c1.png', delay: 0 },
    { id: 2, img: '/coaches/c2.png', delay: 0.4 },
    { id: 3, img: '/coaches/c3.png', delay: 0.8 },
    { id: 4, img: '/coaches/c4.png', delay: 1.2 },
    { id: 5, img: '/coaches/c5.png', delay: 1.6 },
    { id: 6, img: '/coaches/c6.png', delay: 2.0 },
  ];

  const reviews = [
    {
      name: "Maya, 32, Berlin",
      category: "Personal Growth & Clarity",
      text: "SeeMe helped me connect the dots in my life. It's like having a calm, intelligent coach who actually remembers me and keeps me focused.",
      rating: 5
    },
    {
      name: "Daniel, 29, Toronto",
      category: "Privacy & Safety",
      text: "I never realized how much I held back with other AI tools until SeeMe. Knowing my data stays mine changes everything. I can actually be honest.",
      rating: 5
    },
    {
      name: "Lina, 27, San Francisco",
      category: "Daily Reflection & Balance",
      text: "The morning check-ins are my favorite part of the day. They keep me grounded and remind me to slow down before things spiral.",
      rating: 5
    },
    {
      name: "Sophie, 41, London",
      category: "Expert-Guided Coaching Feel",
      text: "It feels like talking to a real mentor. Thoughtful questions, real structure, and gentle accountability without pressure.",
      rating: 5
    },
    {
      name: "Arjun, 35, Mumbai",
      category: "Emotional Connection & Trust",
      text: "SeeMe listens in a way no app ever has. It doesn't just respond. It understands where I am and helps me grow from there.",
      rating: 5
    },
    {
      name: "Isabella, 30, New York",
      category: "Intelligent Questions / Deep Understanding",
      text: "It's wild how well SeeMe knows me now. The questions it asks cut right to the heart of what I'm feeling. Like it sees what I can't yet name.",
      rating: 5
    }
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Background - absolute inside main, not fixed */}
      <div 
        ref={backgroundRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {backgrounds.map((bg, index) => (
          <div
            key={`bg-${index}`}
            data-bg={index}
            className="absolute inset-0"
            style={{ opacity: index === 0 ? 1 : 0 }}
          >
            <Image
              src={bg}
              alt={`Background ${index + 1}`}
              fill
              priority={index === 0}
              quality={90}
              className="object-cover"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div ref={containerRef} className="h-[3200vh] w-screen max-w-full relative z-10 overflow-x-hidden">
        
        {/* Fixed viewport container */}
        <div className="fixed inset-0 w-screen max-w-full overflow-hidden">

        {/* Section 1 - Hero with SeeMe */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 1, pointerEvents: 'auto' }}
        >
          <div
            className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8"
            style={{ gap: 'clamp(1.5rem, 3vh, 3rem)' }}
          >
            {/* Text Group */}
            <div className="flex flex-col items-center flex-shrink-0 drop-shadow-lg">
              {/* Title */}
              <h1
                className="font-black tracking-tight text-white"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                  marginBottom: 'clamp(0.25rem, 0.5vh, 0.75rem)'
                }}
              >
                SeeMe
              </h1>

              {/* Subtitle */}
              <p
                className="text-white/90 text-center px-4 whitespace-nowrap font-medium"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontSize: 'clamp(0.875rem, 2vw, 1.5rem)'
                }}
              >
                Private personal intelligence for your growth
              </p>
            </div>

            {/* Video Mockup Container */}
            <div
              className="relative rounded-[30px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden flex-shrink-0"
              style={{
                width: '240px',
                height: '528px',
                aspectRatio: '240 / 528',
                marginTop: 'clamp(0.5rem, 1vh, 1.5rem)'
              }}
            >
              <SmartVideo
                src={videoUrls.video1}
                priority={true}
                className="rounded-[28px]"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 45%'
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2 - Your Network of Expert Coaches */}
        <div
          ref={section2Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center transition-all duration-1000 ease-out text-content drop-shadow-lg w-full md:w-auto md:max-w-sm"
              style={{ transform: 'translateY(30px) scale(0.95)' }}
            >
              <h2
                className="text-4xl md:text-5xl text-white/80 leading-[1.1]"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
              >
                Your network of<br />
                <span className="text-white font-bold">
                  expert coaches
                </span>
              </h2>
              <p
                className="text-white/90 text-lg mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Crafted with <span className="text-white font-semibold">real coaches and therapists</span>, supporting life, work, wellness, and mindset.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px] flex-shrink-0">
              <SmartVideo
                src={videoUrls.video2}
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />

              <AnimatePresence>
                {activeSection === 1 && coaches.map((coach, index) => {
                  const angle = (index / coaches.length) * Math.PI * 2;
                  const radius = 250;
                  const startX = Math.cos(angle) * radius;
                  const startY = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={coach.id}
                      initial={{
                        x: startX,
                        y: startY,
                        opacity: 0,
                        scale: 0.8
                      }}
                      animate={{
                        x: [startX, 0],
                        y: [startY, 0],
                        opacity: [0, 1, 1, 0],
                        scale: [0.8, 1, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 2.5,
                        delay: coach.delay + 0.3,
                        ease: "easeInOut",
                        times: [0, 0.4, 0.8, 1]
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 pointer-events-none"
                    >
                      <div className="relative w-full h-full rounded-full border-4 border-white shadow-lg overflow-hidden">
                        <Image
                          src={coach.img}
                          alt={`Coach ${coach.id}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Section 3 - Coaches that really KNOW you */}
        <div
          ref={section3Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center transition-all duration-1000 ease-out drop-shadow-lg w-full md:w-auto md:max-w-sm"
              style={{ transform: 'translateY(30px) scale(0.95)' }}
            >
              <h2
                className="text-4xl md:text-5xl text-white/80 leading-[1.1]"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
              >
                Coaches that<br />
                <span className="text-white font-bold">
                  truly understand you
                </span>
              </h2>
              <p
                className="text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px] flex-shrink-0">
              <SmartVideo
                src={videoUrls.video3}
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 4 - Unparalleled insights */}
        <div
          ref={section4Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center transition-all duration-1000 ease-out drop-shadow-lg w-full md:w-auto md:max-w-sm"
              style={{ transform: 'translateY(30px) scale(0.95)' }}
            >
              <h2
                className="text-4xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                <span className="text-white font-bold">
                  Unparalleled insights
                </span><br />
                from your life
              </h2>
              <p
                className="text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Ask anything. SeeMe <span className="text-white font-semibold">reveals patterns</span>, <span className="text-white font-semibold">highlights blind spots</span>, and guides you when it matters.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px] flex-shrink-0">
              <SmartVideo
                src={videoUrls.video4}
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center center' }}
              />
            </div>
          </div>
        </div>

        {/* Section 5 - Expert Strategies */}
        <div
          ref={section5Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          {/* Centered group container */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div
              className="text-center transition-all duration-1000 ease-out drop-shadow-lg w-full md:w-auto md:max-w-sm"
              style={{ transform: 'translateY(30px) scale(0.95)' }}
            >
              <h2
                className="text-4xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                <span className="text-white font-bold">
                  Expert strategies,
                </span><br />
                tailored to you
              </h2>
              <p
                className="text-white/90 text-lg mt-6 font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                <span className="text-white font-semibold">Evidence-based methods</span> and guided sessions, adapted to your goals and daily reality.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px] flex-shrink-0">
              <SmartVideo
                src={videoUrls.video5}
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 6 - So you can RISE */}
        <div
          ref={section6Ref}
          className="absolute inset-0 flex items-start justify-center pt-32"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto drop-shadow-lg">
            <h2
              className="text-5xl md:text-7xl text-white/80 leading-[1.1] transition-all duration-1000 ease-out"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 400,
              }}
            >
              Rise with<br />
              <span
                ref={riseSpanRef}
                className="text-white font-black inline-block"
                style={{ opacity: 0, transform: 'translateY(200px)' }}
              >
                daily guidance
              </span>
            </h2>
            <p
              ref={riseTextRef}
              className="text-white/90 text-xl max-w-2xl mx-auto mt-6 font-normal"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Timely boosts and reminders aligned with your <span className="text-white font-semibold">mood, energy, and intentions.</span>
            </p>
          </div>

          {/* Notification Images - iOS-style below text for mobile, scattered for desktop */}
          {activeSection === 5 && (
            <>
              {/* Mobile: 3 notifications in vertical stack, below the text */}
              <div className="absolute inset-0 pointer-events-none block md:hidden flex items-end justify-center pb-20">
                <div className="flex flex-col gap-3 items-center">
                  <AnimatePresence>
                    {activeSection === 5 && [0, 1, 2].map((offset, idx) => {
                      const notifNum = currentNotification === 1 ? [1, 3, 5][offset] : [2, 4, 6][offset];
                      return (
                        <motion.div
                          key={`${currentNotification}-${offset}`}
                          variants={{
                            enter: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.95 }
                          }}
                          initial="exit"
                          animate="enter"
                          exit="exit"
                          transition={{
                            duration: 0.3, // Quick for both enter and exit
                            ease: "easeOut"
                          }}
                          className="w-[98%] max-w-[420px]"
                        >
                          <Image
                            src={`/notifications/notif${notifNum}.png`}
                            alt="Notification"
                            width={350}
                            height={110}
                            className="drop-shadow-2xl w-full h-auto"
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>

              {/* Desktop: Better notification layout */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {/* Notification container - ensures all notifications stay within bounds */}
                <div className="absolute inset-0 max-w-7xl mx-auto">
                  {/* Top notifications row */}
                  <div className="absolute top-4 left-0 right-0 flex justify-between px-8">
                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [-50, 0, 0, -20],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 0,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif1.png"
                        alt="Notification"
                        width={280}
                        height={85}
                        className="drop-shadow-lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [-50, 0, 0, -20],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 2,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif2.png"
                        alt="Notification"
                        width={280}
                        height={85}
                        className="drop-shadow-lg"
                      />
                    </motion.div>
                  </div>

                  {/* Middle notifications - positioned on sides */}
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-8">
                    <motion.div
                      initial={{ opacity: 0, x: -50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        x: [-50, 0, 0, -30],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 1,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif3.png"
                        alt="Notification"
                        width={240}
                        height={70}
                        className="drop-shadow-lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        x: [50, 0, 0, 30],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 3,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif4.png"
                        alt="Notification"
                        width={240}
                        height={70}
                        className="drop-shadow-lg"
                      />
                    </motion.div>
                  </div>

                  {/* Bottom notifications row */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [50, 0, 0, 20],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 1.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif5.png"
                        alt="Notification"
                        width={220}
                        height={65}
                        className="drop-shadow-lg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        y: [50, 0, 0, 20],
                        scale: [0.8, 1, 1, 0.9]
                      }}
                      transition={{
                        duration: 8,
                        times: [0, 0.15, 0.75, 1],
                        repeat: Infinity,
                        repeatDelay: 4,
                        delay: 2.5,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                      className="pointer-events-none z-20"
                    >
                      <Image
                        src="/notifications/notif6.png"
                        alt="Notification"
                        width={220}
                        height={65}
                        className="drop-shadow-lg"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section 7 - Reviews Section with Motion animations */}
        <div
          ref={section7Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
            <motion.h2
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-5xl text-white text-center mb-16 leading-[1.1] drop-shadow-lg"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 600
              }}
            >
              Loved by people like you
            </motion.h2>
            <p
              className="text-white/90 text-xl max-w-2xl mx-auto mb-12 reviews-text font-normal drop-shadow-lg"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                opacity: 0
              }}
            >
              Authentic stories of <span className="text-white font-semibold">clarity, confidence, and balance</span> from SeeMe's early community.
            </p>

            {/* Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 80,
                    scale: 0.85,
                    rotateX: -20
                  }}
                  animate={activeSection === 6 ? {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0
                  } : {
                    opacity: 0,
                    y: 80,
                    scale: 0.85,
                    rotateX: -20
                  }}
                  transition={{
                    delay: index * 0.3,
                    type: "spring",
                    damping: 25,
                    stiffness: 80,
                    duration: 1.2
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="mb-3"
                  >
                    <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {review.category}
                    </p>
                    <div className="flex mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <motion.svg
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.4 + index * 0.1 + i * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                          className="w-4 h-4 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </motion.svg>
                      ))}
                    </div>
                  </motion.div>
                  <p
                    className="text-white/90 text-base mb-4 leading-relaxed"
                    style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    "{review.text}"
                  </p>
                  <p
                    className="text-white/70 text-xs font-medium italic"
                    style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    {review.name}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Horizontal scrollable carousel */}
            <div className="md:hidden overflow-x-scroll scrollbar-hide">
              <div className="flex gap-4 pb-4 px-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={`mobile-${index}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={activeSection === 6 ? {
                      opacity: 1,
                      x: 0
                    } : {
                      opacity: 0,
                      x: 50
                    }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl flex-shrink-0 w-[85vw] max-w-[340px] ${index === reviews.length - 1 ? 'mr-4' : ''
                      }`}
                  >
                    <div className="mb-3">
                      <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                        {review.category}
                      </p>
                      <div className="flex mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p
                      className="text-white/90 text-base mb-4 leading-relaxed"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      "{review.text}"
                    </p>
                    <p
                      className="text-white/70 text-xs font-medium italic"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      {review.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 - Completely Private */}
        <div
          ref={section8Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 px-4 md:-translate-x-12">
            {/* Text content */}
            <div className="text-center drop-shadow-lg w-full md:w-auto md:max-w-sm">
              <h2
                className="text-4xl md:text-5xl text-white/80 leading-[1.1]"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  fontWeight: 600
                }}
              >
                Your data.<br />
                <span className="text-white font-bold">
                  Always your own.
                </span>
              </h2>
              <p
                className="text-white/90 text-lg mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
              </p>
            </div>

            {/* Video mockup */}
            <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px] flex-shrink-0">
              <SmartVideo
                src={videoUrls.video6}
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 9 - CTA */}
        <div
          ref={section9Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="cta-inner relative z-10 flex flex-col items-center justify-center text-center px-4">
            <h2
              className="text-4xl md:text-6xl text-white/80 leading-[1.1] drop-shadow-lg"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: 600
              }}
            >
              Begin your journey<br />
              <span className="text-white font-bold">
                today.
              </span>
            </h2>
            <p
              className="text-white/90 text-lg md:text-xl max-w-lg mt-6 font-normal drop-shadow-lg"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              Start building your personal intelligence. Calmly, privately, and on your terms.
            </p>
            
            {/* App Store Button */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-2xl"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-lg font-semibold whitespace-nowrap">Download on the App Store</span>
            </a>
          </div>
        </div>
        </div>

      </div>
    </main>
  );
};

export default FinalLanding;
