'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const backgrounds = [
  '/backgrounds/backg1.png',
  '/backgrounds/backg2.png',
  '/backgrounds/backg3.png',
  '/backgrounds/backg4.png',
  '/backgrounds/backg5.png',
  '/backgrounds/backg6.png',
  '/backgrounds/backg7.png',
  '/backgrounds/backg8.png',
  '/backgrounds/backg9.png',
];

const NewLanding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  // Preload all images
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
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

  // Coach animation state for section 2
  const section2Ref = useRef<HTMLDivElement>(null);

  // Track scroll progress for section visibility
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth background transitions with GSAP and magnetic scroll
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2, // Slower, smoother scroll response
        // NO SNAP - let user control their own pace
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
          // Map progress to background index (0-8 for 9 backgrounds)
          const exactBgIndex = progress * (backgrounds.length - 1);
          const bgIndex = Math.floor(exactBgIndex);
          const nextBgIndex = Math.min(bgIndex + 1, backgrounds.length - 1);
          
          if (backgroundRef.current) {
            // Set all backgrounds to 0 opacity first
            backgrounds.forEach((_, index) => {
              const bg = backgroundRef.current!.querySelector(`[data-bg="${index}"]`) as HTMLElement;
              if (bg) gsap.set(bg, { opacity: 0 });
            });
            
            const currentBg = backgroundRef.current.querySelector(`[data-bg="${bgIndex}"]`) as HTMLElement;
            const nextBg = backgroundRef.current.querySelector(`[data-bg="${nextBgIndex}"]`) as HTMLElement;
            
            if (currentBg && nextBg && bgIndex !== nextBgIndex) {
              // Raw progress within this background section (0 to 1)
              const bgProgress = exactBgIndex - bgIndex;
              
              // Delay background transition: start at 20% through the section, end at 80%
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
              // At the very end, just show the last background
              gsap.set(currentBg, { opacity: 1 });
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

  // Helper function - content visible only during its exact background
  const getSectionOpacity = (sectionStart: number, sectionEnd: number) => {
    if (scrollProgress < sectionStart || scrollProgress >= sectionEnd) return 0;
    
    const sectionDuration = sectionEnd - sectionStart;
    const fadeInEnd = sectionStart + sectionDuration * 0.1; // Quick 10% fade in
    const fadeOutStart = sectionEnd - sectionDuration * 0.1; // Quick 10% fade out
    
    if (scrollProgress < fadeInEnd) {
      return gsap.utils.mapRange(sectionStart, fadeInEnd, 0, 1, scrollProgress);
    } else if (scrollProgress > fadeOutStart) {
      return 1 - gsap.utils.mapRange(fadeOutStart, sectionEnd, 0, 1, scrollProgress);
    }
    return 1; // Fully visible for 80% of the section
  };

  const getElementTransform = (sectionStart: number, sectionEnd: number, direction: 'left' | 'right' | 'up' | 'scale' = 'up') => {
    if (scrollProgress < sectionStart || scrollProgress >= sectionEnd) {
      if (direction === 'left') return 'translateX(-50px)'; // Increased from -30px
      if (direction === 'right') return 'translateX(50px)'; // Increased from 30px
      if (direction === 'up') return 'translateY(50px)'; // Increased from 30px
      if (direction === 'scale') return 'scale(0.92)'; // More dramatic scale
    }
    
    const fadeInEnd = sectionStart + (sectionEnd - sectionStart) * 0.2; // Quick entry
    const fadeOutStart = sectionEnd - (sectionEnd - sectionStart) * 0.2; // Quick exit
    
    if (scrollProgress < fadeInEnd) {
      const progress = gsap.utils.mapRange(sectionStart, fadeInEnd, 0, 1, scrollProgress);
      if (direction === 'left') return `translateX(${-50 + progress * 50}px)`;
      if (direction === 'right') return `translateX(${50 - progress * 50}px)`;
      if (direction === 'up') return `translateY(${50 - progress * 50}px)`;
      if (direction === 'scale') return `scale(${0.92 + progress * 0.08})`;
    } else if (scrollProgress > fadeOutStart) {
      const progress = gsap.utils.mapRange(fadeOutStart, sectionEnd, 0, 1, scrollProgress);
      if (direction === 'left') return `translateX(${-progress * 30}px)`;
      if (direction === 'right') return `translateX(${progress * 30}px)`;
      if (direction === 'up') return `translateY(${-progress * 30}px)`;
      if (direction === 'scale') return `scale(${1 - progress * 0.08})`;
    }
    
    if (direction === 'scale') return 'scale(1)';
    return 'translate(0)';
  };

  return (
    <div ref={containerRef} className="h-[3000vh] w-screen max-w-full relative overflow-x-hidden">
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
        {/* Dynamic Backgrounds with smooth transitions */}
        <div ref={backgroundRef} className="absolute inset-0 z-0 w-full h-full">
          {backgrounds.map((bg, index) => (
            <div
              key={`bg-${index}`}
              data-bg={index}
              className="absolute inset-0 w-full h-full"
              style={{
                opacity: index === 0 ? 1 : 0,
              }}
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
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 w-full h-full bg-black/10" />
        </div>

        {/* Section 1 - Hero with SeeMe */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: scrollProgress <= 1/9 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/9, 0, 1, scrollProgress)) : 0,
            pointerEvents: scrollProgress < 1/9 ? 'auto' : 'none' 
          }}
        >
          <div 
            className="relative z-10 flex flex-col items-center justify-center text-center px-4 -mt-8 md:mt-0 md:mb-16 transition-transform duration-500 ease-out"
            style={{ 
              transform: scrollProgress < 0.08 ? 'translateY(0)' : `translateY(${-gsap.utils.mapRange(0.08, 1/9, 0, 30, scrollProgress)}px)`
            }}
          >
            <h1 
              className="text-[90px] sm:text-[100px] md:text-[140px] lg:text-[160px] font-black tracking-tight text-white mb-2 md:mb-4 transition-all duration-700 ease-out flex items-center justify-center gap-1"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 900,
                opacity: scrollProgress <= 1/9 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/9, 0, 1, scrollProgress)) : 0
              }}
            >
              <span
                className="inline-block transition-all duration-1000 ease-out"
                style={{
                  transform: scrollProgress < 0.03 
                    ? 'translateX(0px) rotate(0deg) scale(1)' 
                    : `translateX(${-gsap.utils.mapRange(0.03, 0.08, 0, 150, Math.min(scrollProgress, 0.08))}px) rotate(${-gsap.utils.mapRange(0.03, 0.08, 0, 3, Math.min(scrollProgress, 0.08))}deg) scale(${1 - gsap.utils.mapRange(0.08, 1/9, 0, 0.08, scrollProgress)})`
                }}
              >
                See
              </span>
              <span
                className="inline-block transition-all duration-1000 ease-out"
                style={{
                  transform: scrollProgress < 0.03 
                    ? 'translateX(0px) rotate(0deg) scale(1)' 
                    : `translateX(${gsap.utils.mapRange(0.03, 0.08, 0, 150, Math.min(scrollProgress, 0.08))}px) rotate(${gsap.utils.mapRange(0.03, 0.08, 0, 3, Math.min(scrollProgress, 0.08))}deg) scale(${1 - gsap.utils.mapRange(0.08, 1/9, 0, 0.08, scrollProgress)})`
                }}
              >
                Me
              </span>
            </h1>
            <p 
              className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 md:mb-8 transition-opacity duration-700 ease-out"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 400,
                opacity: scrollProgress <= 1/9 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/9, 0, 1, scrollProgress)) : 0
              }}
            >
              My Companion for greatness
            </p>
            
            {/* iPhone Mockup with Video - Section 1 */}
            <div
              className="relative w-[300px] h-[615px] sm:w-[220px] sm:h-[450px] md:w-[260px] md:h-[530px] transition-all duration-1000 ease-out"
              style={{
                opacity: scrollProgress < 0.14 ? 1 : gsap.utils.mapRange(0.14, 0.18, 1, 0, Math.min(scrollProgress, 0.18)),
                transform: scrollProgress < 0.08 
                  ? 'scale(1)' 
                  : `scale(${gsap.utils.mapRange(0.08, 0.18, 1, 1.35, Math.min(scrollProgress, 0.18))})`,
                pointerEvents: scrollProgress < 1/9 ? 'auto' : 'none'
              }}
            >
              <div className="absolute inset-0 bg-black rounded-[40px] border-[4px] border-gray-900 shadow-2xl">
                <div className="absolute inset-[2px] rounded-[36px] overflow-hidden">
                  <video
                    src="/videos/video1.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - My Personal Network of Coaches */}
        <div 
          ref={section2Ref} 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: getSectionOpacity(1/9, 2/9), pointerEvents: scrollProgress >= 1/9 && scrollProgress < 2/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {/* Left Text */}
          <div 
            className="flex-1 text-center transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(1/9, 2/9),
              transform: `translateY(${scrollProgress >= 1/9 && scrollProgress < 2/9 ? 0 : 30}px) scale(${scrollProgress >= 1/9 && scrollProgress < 2/9 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
            >
              My Personal<br />Network of<br />Coaches
            </h2>
          </div>

          {/* Center iPhone Mockup with Flying Coaches */}
          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px]">
              <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl overflow-hidden">
                <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                  <video
                    src="/videos/video2.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Flying Coach Avatars - fly INTO device */}
              <AnimatePresence>
                {scrollProgress >= 1/9 && scrollProgress < 2/9 && coaches.map((coach, index) => {
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

            {/* Right spacer for balance */}
            <div className="flex-1" />
          </div>
        </div>

        {/* Section 3 - Coaches that really KNOW me */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: getSectionOpacity(2/9, 3/9), pointerEvents: scrollProgress >= 2/9 && scrollProgress < 3/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div 
            className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(2/9, 3/9),
              transform: `translateX(${scrollProgress >= 2/9 && scrollProgress < 3/9 ? 0 : -30}px) scale(${scrollProgress >= 2/9 && scrollProgress < 3/9 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
            >
              Coaches<br />that really<br />KNOW me
            </h2>
          </div>

          {/* Center iPhone Mockup */}
          <div
            className="relative w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(2/9, 3/9),
              transform: `scale(${scrollProgress >= 2/9 && scrollProgress < 3/9 ? 1 : 0.9})`
            }}
          >
            <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl">
              <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                <video
                  src="/videos/video3.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div 
            className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(2/9, 3/9),
              transform: `translateX(${scrollProgress >= 2/9 && scrollProgress < 3/9 ? 0 : 30}px) scale(${scrollProgress >= 2/9 && scrollProgress < 3/9 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
            >
              Calendar<br />Health<br />Screentime
            </h2>
            </div>
          </div>
        </div>

        {/* Section 4 - Unparalled Insights */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: getSectionOpacity(3/9, 4/9), pointerEvents: scrollProgress >= 3/9 && scrollProgress < 4/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Text */}
            <div 
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(3/9, 4/9),
                transform: `translateX(${scrollProgress >= 3/9 && scrollProgress < 4/9 ? 0 : -30}px) scale(${scrollProgress >= 3/9 && scrollProgress < 4/9 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 400
                }}
              >
                Unparalled<br />Insights
              </h2>
            </div>

            {/* Center iPhone Mockup */}
            <div
              className="relative w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(3/9, 4/9),
                transform: `scale(${scrollProgress >= 3/9 && scrollProgress < 4/9 ? 1 : 0.9})`
              }}
            >
              <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl">
                <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                  <video
                    src="/videos/video4.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right spacer for balance */}
            <div className="flex-1 md:order-3" />
          </div>
        </div>

        {/* Section 5 - On demand Sessions */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: getSectionOpacity(4/9, 5/9), pointerEvents: scrollProgress >= 4/9 && scrollProgress < 5/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Text */}
            <div 
              className="flex-1 text-center transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(4/9, 5/9),
                transform: `translateX(${scrollProgress >= 4/9 && scrollProgress < 5/9 ? 0 : -30}px) scale(${scrollProgress >= 4/9 && scrollProgress < 5/9 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
              >
                On demand<br />Sessions
              </h2>
            </div>

            {/* Center iPhone Mockup */}
            <div 
              className="relative w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px] transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(4/9, 5/9),
                transform: `scale(${scrollProgress >= 4/9 && scrollProgress < 5/9 ? 1 : 0.9})`
              }}
            >
              <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl">
                <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                  <video
                    src="/videos/video5.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div 
              className="flex-1 text-center transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(4/9, 5/9),
                transform: `translateX(${scrollProgress >= 4/9 && scrollProgress < 5/9 ? 0 : 30}px) scale(${scrollProgress >= 4/9 && scrollProgress < 5/9 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
                style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
              >
                With<br />100+<br />Voices
              </h2>
            </div>
          </div>
        </div>

        {/* Section 6 - Curated Expert Sessions */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: getSectionOpacity(5/9, 6/9), pointerEvents: scrollProgress >= 5/9 && scrollProgress < 6/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Text */}
            <div 
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(5/9, 6/9),
                transform: `translateX(${scrollProgress >= 5/9 && scrollProgress < 6/9 ? 0 : -30}px) scale(${scrollProgress >= 5/9 && scrollProgress < 6/9 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-tight"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 400
                }}
              >
                Curated<br />Expert<br />Sessions
              </h2>
            </div>

            {/* Center iPhone Mockup */}
            <div
              className="relative w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(5/9, 6/9),
                transform: `scale(${scrollProgress >= 5/9 && scrollProgress < 6/9 ? 1 : 0.9})`
              }}
            >
              <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl">
                <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                  <video
                    src="/videos/video6.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right spacer for balance */}
            <div className="flex-1 md:order-3" />
          </div>
        </div>

        {/* Section 7 - So you can RISE */}
        <div 
          className="absolute inset-0 flex items-start justify-center pt-32"
          style={{ opacity: getSectionOpacity(6/9, 7/9), pointerEvents: scrollProgress >= 6/9 && scrollProgress < 7/9 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 text-center px-4">
            <h2 
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-tight transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 400,
                opacity: getSectionOpacity(6/9, 7/9)
              }}
            >
              So you can<br />
              <span 
                className="font-black inline-block"
                style={{
                  opacity: scrollProgress >= 6/9 && scrollProgress < 7/9 
                    ? gsap.utils.mapRange(6/9, 6.8/9, 0, 1, Math.min(scrollProgress, 6.8/9))
                    : scrollProgress >= 7/9 ? 0 : 0,
                  transform: scrollProgress >= 6/9 && scrollProgress < 7/9
                    ? `translateY(${gsap.utils.mapRange(6/9, 6.8/9, 200, 0, Math.min(scrollProgress, 6.8/9))}px)`
                    : scrollProgress >= 7/9 ? 'translateY(0px)' : 'translateY(200px)'
                }}
              >
                RISE
              </span>
            </h2>
          </div>
        </div>

        {/* Section 8 - And find your purpose */}
        <div 
          className="absolute inset-0 flex items-start justify-center pt-32"
          style={{ opacity: getSectionOpacity(7/9, 8/9), pointerEvents: scrollProgress >= 7/9 && scrollProgress < 8/9 ? 'auto' : 'none' }}
        >
          <div 
            className="relative z-10 text-center px-4 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(7/9, 8/9),
              transform: `translateY(${scrollProgress >= 7/9 && scrollProgress < 8/9 ? 0 : 40}px) scale(${scrollProgress >= 7/9 && scrollProgress < 8/9 ? 1 : 0.9})`
            }}
          >
            <h2 
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white leading-tight"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 400
              }}
            >
              And find your purpose
            </h2>
          </div>
        </div>

        {/* Section 9 - Lock Animation + Download Button */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: scrollProgress >= 8/9 ? 1 : 0,
            pointerEvents: scrollProgress >= 8/9 ? 'auto' : 'none' 
          }}
        >
          {/* Mockup - centered on screen, stays visible */}
          <div
            className="absolute w-[240px] h-[490px] sm:w-[280px] sm:h-[570px] md:w-[320px] md:h-[650px] transition-all duration-1000 ease-out"
            style={{
              top: '50%',
              left: '50%',
              opacity: scrollProgress >= 8/9 ? gsap.utils.mapRange(8/9, 0.95, 0, 1, Math.min(scrollProgress, 0.95)) : 0,
              transform: `translate(-50%, -50%) scale(${scrollProgress >= 8/9 ? gsap.utils.mapRange(8/9, 0.95, 0.95, 1, Math.min(scrollProgress, 0.95)) : 0.95})`
            }}
          >
            <div className="absolute inset-0 bg-black rounded-[50px] border-[4px] border-gray-900 shadow-2xl">
              <div className="absolute inset-[2px] rounded-[46px] overflow-hidden">
                <video
                  src="/videos/video9.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Download Button - appears at bottom, stays visible */}
          <div 
            className="absolute transition-all duration-1000 ease-out"
            style={{
              bottom: '1.5rem',
              left: '50%',
              opacity: scrollProgress >= 0.97 ? 1 : gsap.utils.mapRange(0.94, 0.97, 0, 1, Math.max(scrollProgress, 0.94)),
              transform: `translateX(-50%) translateY(${scrollProgress >= 0.97 ? 0 : gsap.utils.mapRange(0.94, 0.97, 40, 0, scrollProgress)}px)`
            }}
          >
            {/* App Store Button */}
            <button className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl flex items-center justify-center gap-1.5 text-xs md:text-sm group whitespace-nowrap">
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              <span>Download on App Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLanding;
