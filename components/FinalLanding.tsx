'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  const riseSpanRef = useRef<HTMLSpanElement>(null);
  const riseTextRef = useRef<HTMLParagraphElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [currentNotification, setCurrentNotification] = useState(1);

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
  }, []);

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
            // Get current scroll velocity
            const velocity = Math.abs(ScrollTrigger.getById('main-scroll')?.getVelocity() || 0);
            
            // If scrolling fast, don't snap - let user fly through
            if (velocity > 200) {
              return progress; // Return current progress, no snapping
            }
            
            // If scrolling slowly or stopped, snap to nearest section
            const snapPoints = [0, 0.1875, 0.3125, 0.4375, 0.5625, 0.6875, 0.8125, 1];
            const closest = snapPoints.reduce((prev, curr) => 
              Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
            );
            
            // Only snap if we're reasonably close to a section
            const distance = Math.abs(closest - progress);
            return distance < 0.15 ? closest : progress;
          },
          duration: { min: 0.6, max: 1.4 }, // Slightly longer duration for smoother feel
          delay: 0.3, // Longer delay to give user more control
          ease: "power2.inOut"
        },
        id: 'main-scroll', // Give it an ID so we can reference it for velocity
        onUpdate: (self) => {
          const progress = self.progress;

          // Update Active Section (0-7) for conditional rendering of heavy components
          // We use a slight buffer to ensure we don't flicker at boundaries
          const newSection = Math.min(Math.floor(progress * 8), 7);
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

          // Section 1: Hero (0 - 1/8)
          if (heroRef.current) {
            // Custom logic for Hero from original: fade out only
            const opacity = progress <= 1 / 8 ? (progress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1 / 8, 0, 1, progress)) : 0;
            heroRef.current.style.opacity = String(opacity);
            heroRef.current.style.pointerEvents = progress < 1 / 8 ? 'auto' : 'none';
          }

          // Section 2: Network (1/8 - 2/8)
          if (section2Ref.current) {
            const start = 1 / 8, end = 2 / 8;
            const opacity = getSectionOpacity(start, end);
            section2Ref.current.style.opacity = String(opacity);
            section2Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // Transform logic for text content (first child)
            const textContent = section2Ref.current.querySelector('.text-content') as HTMLElement;
            if (textContent) {
              textContent.style.transform = progress >= start && progress < end ? 'translateY(0px) scale(1)' : 'translateY(30px) scale(0.95)';
            }
          }

          // Section 3: Understanding (2/8 - 3/8)
          if (section3Ref.current) {
            const start = 2 / 8, end = 3 / 8;
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

          // Section 4: Insights (3/8 - 4/8)
          if (section4Ref.current) {
            const start = 3 / 8, end = 4 / 8;
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

          // Section 5: Strategies (4/8 - 5/8)
          if (section5Ref.current) {
            const start = 4 / 8, end = 5 / 8;
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

          // Section 6: Rise (5/8 - 6/8)
          if (section6Ref.current) {
            const start = 5 / 8, end = 6 / 8;
            section6Ref.current.style.opacity = String(getSectionOpacity(start, end));
            section6Ref.current.style.pointerEvents = progress >= start && progress < end ? 'auto' : 'none';

            // Special logic for the "daily guidance" span
            if (riseSpanRef.current) {
              const spanStart = 5 / 8;
              const spanEnd = 5.5 / 8; // Finishes earlier to stay longer
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

          // Section 7: Reviews (6/8 - 7/8) - Extended duration
          if (section7Ref.current) {
            const start = 6 / 8, end = 7 / 8;
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

          // Section 8: Privacy (7/8 - 1)
          if (section8Ref.current) {
            const start = 7 / 8;
            const isActive = progress >= start;
            section8Ref.current.style.opacity = isActive ? '1' : '0';
            section8Ref.current.style.pointerEvents = isActive ? 'auto' : 'none';

            const leftCol = section8Ref.current.querySelector('.left-col') as HTMLElement;
            const videoContainer = section8Ref.current.querySelector('.video-container') as HTMLElement;

            if (isActive) {
              const p = Math.min(progress, 0.95);
              const p2 = Math.min(progress, 0.98);

              if (leftCol) {
                leftCol.style.opacity = String(gsap.utils.mapRange(start, 0.95, 0, 1, p));
                leftCol.style.transform = `translateX(0px) scale(1)`;
              }
              if (videoContainer) {
                videoContainer.style.opacity = String(gsap.utils.mapRange(start, 0.98, 0, 1, p2));
                videoContainer.style.transform = `scale(${gsap.utils.mapRange(start, 0.98, 0.95, 1, p2)})`;
              }
            } else {
              if (leftCol) {
                leftCol.style.opacity = '0';
                leftCol.style.transform = 'translateX(-30px) scale(0.95)';
              }
              if (videoContainer) {
                videoContainer.style.opacity = '0';
                videoContainer.style.transform = 'scale(0.95)';
              }
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
      name: "Maya, 32 — Berlin",
      category: "Personal Growth & Clarity",
      text: "SeeMe helped me connect the dots in my life — it's like having a calm, intelligent coach who actually remembers me and keeps me focused.",
      rating: 5
    },
    {
      name: "Daniel, 29 — Toronto",
      category: "Privacy & Safety",
      text: "I never realized how much I held back with other AI tools until SeeMe. Knowing my data stays mine changes everything — I can actually be honest.",
      rating: 5
    },
    {
      name: "Lina, 27 — San Francisco",
      category: "Daily Reflection & Balance",
      text: "The morning check-ins are my favorite part of the day. They keep me grounded and remind me to slow down before things spiral.",
      rating: 5
    },
    {
      name: "Sophie, 41 — London",
      category: "Expert-Guided Coaching Feel",
      text: "It feels like talking to a real mentor — thoughtful questions, real structure, and gentle accountability without pressure.",
      rating: 5
    },
    {
      name: "Arjun, 35 — Mumbai",
      category: "Emotional Connection & Trust",
      text: "SeeMe listens in a way no app ever has. It doesn't just respond — it understands where I am and helps me grow from there.",
      rating: 5
    },
    {
      name: "Isabella, 30 — New York",
      category: "Intelligent Questions / Deep Understanding",
      text: "It's wild how well SeeMe knows me now. The questions it asks cut right to the heart of what I'm feeling — like it sees what I can't yet name.",
      rating: 5
    }
  ];

  return (
    <div ref={containerRef} className="h-[3200vh] w-screen max-w-full relative overflow-x-hidden">
      {/* Loading indicator */}
      {!imagesLoaded && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      )}

      {/* Fixed viewport container */}
      <div className="fixed inset-0 w-screen max-w-full h-screen overflow-hidden">
        {/* Dynamic Backgrounds */}
        <div ref={backgroundRef} className="absolute inset-0 z-0 w-full h-full">
          {backgrounds.map((bg, index) => (
            <div
              key={`bg-${index}`}
              data-bg={index}
              className="absolute inset-0 w-full h-full"
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
          <div className="absolute inset-0 w-full h-full bg-black/40" />
        </div>

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
                Your private AI for clarity, balance, and deeply personalized growth
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
              <video
                src="/videos/video1.mp4"
                autoPlay
                loop
                muted
                playsInline
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
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            <div
              className="flex-1 text-center transition-all duration-1000 ease-out text-content drop-shadow-lg"
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
                className="text-white/90 text-xl max-w-2xl mx-auto mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Crafted with <span className="text-white font-semibold">real coaches and therapists</span>—supporting life, work, wellness, and mindset.
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden w-[280px] h-[615px]">
                <video
                  src="/videos/video2.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
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

            <div className="flex-1" />
          </div>
        </div>

        {/* Section 3 - Coaches that really KNOW you */}
        <div
          ref={section3Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out left-col drop-shadow-lg"
              style={{ transform: 'translateX(-30px) scale(0.95)' }}
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
            </div>

            <div
              className="relative md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden center-video w-[280px] h-[615px]"
              style={{ transform: 'scale(0.9)' }}
            >
              <video
                src="/videos/video3.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>

            <div
              className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out right-col drop-shadow-lg"
              style={{ transform: 'translateX(30px) scale(0.95)' }}
            >
              <p
                className="text-white/90 text-lg max-w-md mx-auto font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Learning from your <span className="text-white font-semibold">sessions, reflections, calendar, health,</span> and <span className="text-white font-semibold">screen time</span> patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 - Guidance that feels intuitive */}
        <div
          ref={section4Ref}
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out left-col drop-shadow-lg"
              style={{ transform: 'translateX(-30px) scale(0.95)' }}
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
            </div>

            <div
              className="relative md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden center-video w-[280px] h-[615px]"
              style={{ transform: 'scale(0.9)' }}
            >
              <video
                src="/videos/video4.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center center' }}
              />
            </div>

            <div
              className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out right-col drop-shadow-lg"
              style={{ transform: 'translateX(30px) scale(0.95)' }}
            >
              <p
                className="text-white/90 text-lg max-w-md mx-auto font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                Ask anything—SeeMe <span className="text-white font-semibold">reveals patterns</span>, <span className="text-white font-semibold">highlights blind spots</span>, and guides you when it matters.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 - Expert Strategies */}
        <div
          ref={section5Ref}
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out left-col drop-shadow-lg"
              style={{ transform: 'translateX(-30px) scale(0.95)' }}
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
            </div>

            <div
              className="relative md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden center-video w-[280px] h-[615px]"
              style={{ transform: 'scale(0.9)' }}
            >
              <video
                src="/videos/video5.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>

            <div
              className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out right-col drop-shadow-lg"
              style={{ transform: 'translateX(30px) scale(0.95)' }}
            >
              <p
                className="text-white/90 text-lg max-w-md mx-auto font-normal"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                <span className="text-white font-semibold">Evidence-based methods</span> and guided sessions, adapted to your goals and daily reality.
              </p>
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

              {/* Desktop: Scattered notifications */}
              <div className="absolute inset-0 pointer-events-none hidden md:block">
                {/* Random notification 1 - top left */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 2,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: 'clamp(2rem, 8vh, 4rem)',
                    left: 'clamp(1rem, 6vw, 3rem)',
                    width: 'clamp(10rem, 18vw, 16rem)',
                    maxWidth: '280px'
                  }}
                >
                  <Image
                    src="/notifications/notif1.png"
                    alt="Notification"
                    width={288}
                    height={90}
                    className="drop-shadow-2xl"
                  />
                </motion.div>

                {/* Random notification 2 - top right */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: 'clamp(2rem, 8vh, 4rem)',
                    right: 'clamp(1rem, 6vw, 3rem)',
                    width: 'clamp(10rem, 18vw, 16rem)',
                    maxWidth: '280px'
                  }}
                >
                  <Image
                    src="/notifications/notif2.png"
                    alt="Notification"
                    width={288}
                    height={90}
                    className="drop-shadow-2xl"
                  />
                </motion.div>

                {/* Random notification 3 - bottom left */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 4,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    bottom: 'clamp(3rem, 14vh, 8rem)',
                    left: 'clamp(1rem, 6vw, 3rem)',
                    width: 'clamp(10rem, 18vw, 16rem)',
                    maxWidth: '280px'
                  }}
                >
                  <Image
                    src="/notifications/notif3.png"
                    alt="Notification"
                    width={288}
                    height={90}
                    className="drop-shadow-2xl"
                  />
                </motion.div>

                {/* Random notification 4 - bottom right */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    bottom: 'clamp(3rem, 14vh, 8rem)',
                    right: 'clamp(1rem, 6vw, 3rem)',
                    width: 'clamp(10rem, 18vw, 16rem)',
                    maxWidth: '280px'
                  }}
                >
                  <Image
                    src="/notifications/notif4.png"
                    alt="Notification"
                    width={288}
                    height={90}
                    className="drop-shadow-2xl"
                  />
                </motion.div>

                {/* Random notification 5 - middle left */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 3.5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: 'clamp(30%, 35vh, 40%)',
                    left: 'clamp(1rem, 5vw, 2.5rem)',
                    width: 'clamp(9rem, 16vw, 14rem)',
                    maxWidth: '240px'
                  }}
                >
                  <Image
                    src="/notifications/notif5.png"
                    alt="Notification"
                    width={256}
                    height={80}
                    className="drop-shadow-2xl"
                  />
                </motion.div>

                {/* Random notification 6 - middle right */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 4,
                    delay: Math.random() * 4.5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute pointer-events-none z-20"
                  style={{
                    top: 'clamp(30%, 35vh, 40%)',
                    right: 'clamp(1rem, 5vw, 2.5rem)',
                    width: 'clamp(9rem, 16vw, 14rem)',
                    maxWidth: '240px'
                  }}
                >
                  <Image
                    src="/notifications/notif6.png"
                    alt="Notification"
                    width={256}
                    height={80}
                    className="drop-shadow-2xl"
                  />
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Section 7 - Reviews Section with Motion animations */}
        <div
          ref={section7Ref}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
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
                    — {review.name}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Mobile: Horizontal scrollable carousel */}
            <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-4 pb-4">
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
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl flex-shrink-0 w-[85vw] max-w-[340px]"
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
                      className="text-white/90 text-sm mb-3 leading-relaxed"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      "{review.text}"
                    </p>
                    <p
                      className="text-white/70 text-xs font-medium italic"
                      style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      — {review.name}
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
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out left-col drop-shadow-lg"
              style={{ transform: 'translateX(-30px) scale(0.95)' }}
            >
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
                className="text-white/90 text-xl max-w-2xl mx-auto mt-6 font-normal"
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Built <span className="text-white font-semibold">private-first</span> with on-device intelligence and secure optional cloud enhancements.
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 md:order-2">
              <div
                className="relative transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden video-container w-[280px] h-[615px]"
                style={{ transform: 'scale(0.95)' }}
              >
                <video
                  src="/videos/video6.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-[28px]"
                  style={{ objectPosition: 'center 45%' }}
                />
              </div>
            </div>

            <div className="flex-1 md:order-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalLanding;
