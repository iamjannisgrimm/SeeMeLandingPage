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
  '/backgrounds/backg2.png',
  '/backgrounds/backg3.png',
  '/backgrounds/backg3.png',
  '/backgrounds/backg4.png',
  '/backgrounds/backg5.png',
  '/backgrounds/backg6.png',
];

const NewLanding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

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

  const section2Ref = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Smooth background transitions with GSAP
  useEffect(() => {
    if (!imagesLoaded) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          
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

  const getSectionOpacity = (sectionStart: number, sectionEnd: number) => {
    if (scrollProgress < sectionStart || scrollProgress >= sectionEnd) return 0;
    
    const sectionDuration = sectionEnd - sectionStart;
    const fadeInEnd = sectionStart + sectionDuration * 0.1;
    const fadeOutStart = sectionEnd - sectionDuration * 0.1;
    
    if (scrollProgress < fadeInEnd) {
      return gsap.utils.mapRange(sectionStart, fadeInEnd, 0, 1, scrollProgress);
    } else if (scrollProgress > fadeOutStart) {
      return 1 - gsap.utils.mapRange(fadeOutStart, sectionEnd, 0, 1, scrollProgress);
    }
    return 1;
  };

  const getElementTransform = (sectionStart: number, sectionEnd: number, direction: 'left' | 'right' | 'up' | 'scale' = 'up') => {
    if (scrollProgress < sectionStart || scrollProgress >= sectionEnd) {
      if (direction === 'left') return 'translateX(-50px)';
      if (direction === 'right') return 'translateX(50px)';
      if (direction === 'up') return 'translateY(50px)';
      if (direction === 'scale') return 'scale(0.92)';
    }
    
    const fadeInEnd = sectionStart + (sectionEnd - sectionStart) * 0.2;
    const fadeOutStart = sectionEnd - (sectionEnd - sectionStart) * 0.2;
    
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const reviewVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
        duration: 0.8
      }
    }
  };

  return (
    <div ref={containerRef} className="h-[800vh] w-screen max-w-full relative overflow-x-hidden">
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
          <div className="absolute inset-0 w-full h-full bg-black/10" />
        </div>

        {/* Section 1 - Hero with SeeMe */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: scrollProgress <= 1/8 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/8, 0, 1, scrollProgress)) : 0,
            pointerEvents: scrollProgress < 1/8 ? 'auto' : 'none' 
          }}
        >
          <div 
            className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-8 md:mt-0 md:mb-16 transition-transform duration-500 ease-out"
            style={{ 
              transform: scrollProgress < 0.08 ? 'translateY(0)' : `translateY(${-gsap.utils.mapRange(0.08, 1/8, 0, 30, scrollProgress)}px)`
            }}
          >
            <h1 
              className="text-[90px] sm:text-[100px] md:text-[140px] lg:text-[160px] font-black tracking-tight text-white mb-3 md:mb-4 transition-all duration-700 ease-out flex items-center justify-center gap-1"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 900,
                opacity: scrollProgress <= 1/8 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/8, 0, 1, scrollProgress)) : 0
              }}
            >
              <span
                className="inline-block transition-all duration-1000 ease-out"
                style={{
                  transform: scrollProgress < 0.03 
                    ? 'translateX(0px) rotate(0deg) scale(1)' 
                    : `translateX(${-gsap.utils.mapRange(0.03, 0.08, 0, 150, Math.min(scrollProgress, 0.08))}px) rotate(${-gsap.utils.mapRange(0.03, 0.08, 0, 3, Math.min(scrollProgress, 0.08))}deg) scale(${1 - gsap.utils.mapRange(0.08, 1/8, 0, 0.08, scrollProgress)})`
                }}
              >
                See
              </span>
              <span
                className="inline-block transition-all duration-1000 ease-out"
                style={{
                  transform: scrollProgress < 0.03 
                    ? 'translateX(0px) rotate(0deg) scale(1)' 
                    : `translateX(${gsap.utils.mapRange(0.03, 0.08, 0, 150, Math.min(scrollProgress, 0.08))}px) rotate(${gsap.utils.mapRange(0.03, 0.08, 0, 3, Math.min(scrollProgress, 0.08))}deg) scale(${1 - gsap.utils.mapRange(0.08, 1/8, 0, 0.08, scrollProgress)})`
                }}
              >
                Me
              </span>
            </h1>
            <p 
              className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-16 md:mb-20 transition-opacity duration-700 ease-out"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 400,
                opacity: scrollProgress <= 1/8 ? (scrollProgress < 0.08 ? 1 : 1 - gsap.utils.mapRange(0.08, 1/8, 0, 1, scrollProgress)) : 0
              }}
            >
              Your private AI for clarity, balance, and deeply personalized growth.
            </p>
            
            <div
              className="relative w-[280px] h-[615px] sm:w-[200px] sm:h-[450px] md:w-[240px] md:h-[530px] transition-all duration-1000 ease-out rounded-[30px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden"
              style={{
                opacity: scrollProgress < 0.14 ? 1 : gsap.utils.mapRange(0.14, 0.18, 1, 0, Math.min(scrollProgress, 0.18)),
                transform: scrollProgress < 0.08 
                  ? 'scale(1)' 
                  : `scale(${gsap.utils.mapRange(0.08, 0.18, 1, 1.35, Math.min(scrollProgress, 0.18))})`,
                pointerEvents: scrollProgress < 1/8 ? 'auto' : 'none'
              }}
            >
              <video
                src="/videos/video1.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-[28px]"
                style={{ objectPosition: 'center 45%' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2 - My Custom Network of Coaches */}
        <div 
          ref={section2Ref} 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: getSectionOpacity(1/8, 2/8), pointerEvents: scrollProgress >= 1/8 && scrollProgress < 2/8 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          <div 
            className="flex-1 text-center transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(1/8, 2/8),
              transform: `translateY(${scrollProgress >= 1/8 && scrollProgress < 2/8 ? 0 : 30}px) scale(${scrollProgress >= 1/8 && scrollProgress < 2/8 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1]"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
            >
              My custom<br />network of<br />coaches
            </h2>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-[220px] h-[490px] sm:w-[260px] sm:h-[570px] md:w-[300px] md:h-[650px] rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden">
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
                {scrollProgress >= 1/8 && scrollProgress < 2/8 && coaches.map((coach, index) => {
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

        {/* Section 3 - Coaches that really KNOW me */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: getSectionOpacity(2/8, 3/8), pointerEvents: scrollProgress >= 2/8 && scrollProgress < 3/8 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div 
            className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(2/8, 3/8),
              transform: `translateX(${scrollProgress >= 2/8 && scrollProgress < 3/8 ? 0 : -30}px) scale(${scrollProgress >= 2/8 && scrollProgress < 3/8 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1]"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 600 }}
            >
              Coaches<br />that really<br />know me
            </h2>
          </div>

          <div
            className="relative w-[220px] h-[490px] sm:w-[260px] sm:h-[570px] md:w-[300px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden"
            style={{
              opacity: getSectionOpacity(2/8, 3/8),
              transform: `scale(${scrollProgress >= 2/8 && scrollProgress < 3/8 ? 1 : 0.9})`
            }}
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
            className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out"
            style={{
              opacity: getSectionOpacity(2/8, 3/8),
              transform: `translateX(${scrollProgress >= 2/8 && scrollProgress < 3/8 ? 0 : 30}px) scale(${scrollProgress >= 2/8 && scrollProgress < 3/8 ? 1 : 0.95})`
            }}
          >
            <h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-[1.4] max-w-xl mx-auto"
              style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', fontWeight: 400 }}
            >
              Connected to your<br />
              <span className="font-semibold text-white">Calendar, Health, ScreenTime</span><br />
              for optimal personalization.<br />
              Your coach learns about you<br />
              from every interaction.
            </h2>
            </div>
          </div>
        </div>

        {/* Section 4 - Unparalled Insights */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: getSectionOpacity(3/8, 4/8), pointerEvents: scrollProgress >= 3/8 && scrollProgress < 4/8 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div 
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(3/8, 4/8),
                transform: `translateX(${scrollProgress >= 3/8 && scrollProgress < 4/8 ? 0 : -30}px) scale(${scrollProgress >= 3/8 && scrollProgress < 4/8 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1]"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 600
                }}
              >
                Unparalleled<br />insights
              </h2>
            </div>

            <div
              className="relative w-[220px] h-[490px] sm:w-[260px] sm:h-[570px] md:w-[300px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden"
              style={{
                opacity: getSectionOpacity(3/8, 4/8),
                transform: `scale(${scrollProgress >= 3/8 && scrollProgress < 4/8 ? 1 : 0.9})`
              }}
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
              className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(3/8, 4/8),
                transform: `translateX(${scrollProgress >= 3/8 && scrollProgress < 4/8 ? 0 : 30}px) scale(${scrollProgress >= 3/8 && scrollProgress < 4/8 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white leading-[1.5] max-w-lg mx-auto"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 400
                }}
              >
                Your coaches know when to consult<br />
                with your other coaches and when<br />
                to set reminders or events<br />
                in the calendar.
              </h2>
            </div>
          </div>
        </div>

        {/* Section 5 - Expert Curated Sessions */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: getSectionOpacity(4/8, 5/8), pointerEvents: scrollProgress >= 4/8 && scrollProgress < 5/8 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div 
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(4/8, 5/8),
                transform: `translateX(${scrollProgress >= 4/8 && scrollProgress < 5/8 ? 0 : -30}px) scale(${scrollProgress >= 4/8 && scrollProgress < 5/8 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1]"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 600
                }}
              >
                Expert<br />Curated<br />Sessions
              </h2>
            </div>

            <div
              className="relative w-[220px] h-[490px] sm:w-[260px] sm:h-[570px] md:w-[300px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden"
              style={{
                opacity: getSectionOpacity(4/8, 5/8),
                transform: `scale(${scrollProgress >= 4/8 && scrollProgress < 5/8 ? 1 : 0.9})`
              }}
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
              className="flex-1 text-center md:order-3 transition-all duration-1000 ease-out"
              style={{
                opacity: getSectionOpacity(4/8, 5/8),
                transform: `translateX(${scrollProgress >= 4/8 && scrollProgress < 5/8 ? 0 : 30}px) scale(${scrollProgress >= 4/8 && scrollProgress < 5/8 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white leading-[1.5] max-w-lg mx-auto"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 400
                }}
              >
                Licensed life coaches and therapists<br />
                have built sessions based on their<br />
                knowledge and styles that can<br />
                completely adapt to your needs.
              </h2>
            </div>
          </div>
        </div>

        {/* Section 6 - So you can RISE */}
        <div 
          className="absolute inset-0 flex items-start justify-center pt-32"
          style={{ opacity: getSectionOpacity(5/8, 6/8), pointerEvents: scrollProgress >= 5/8 && scrollProgress < 6/8 ? 'auto' : 'none' }}
        >
          <div className="relative z-10 text-center px-4 w-full max-w-7xl mx-auto">
            <h2 
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-[1.1] transition-all duration-1000 ease-out"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 400,
                opacity: getSectionOpacity(5/8, 6/8)
              }}
            >
              So you can<br />
              <span 
                className="font-black inline-block"
                style={{
                  opacity: scrollProgress >= 5/8 && scrollProgress < 6/8 
                    ? gsap.utils.mapRange(5/8, 5.8/8, 0, 1, Math.min(scrollProgress, 5.8/8))
                    : scrollProgress >= 6/8 ? 0 : 0,
                  transform: scrollProgress >= 5/8 && scrollProgress < 6/8
                    ? `translateY(${gsap.utils.mapRange(5/8, 5.8/8, 200, 0, Math.min(scrollProgress, 5.8/8))}px)`
                    : scrollProgress >= 6/8 ? 'translateY(0px)' : 'translateY(200px)'
                }}
              >
                rise
              </span>
            </h2>
          </div>

          {/* Notification Images - Random iOS-style pop animations - positioned relative to viewport */}
          {scrollProgress >= 5/8 && scrollProgress < 6/8 && (
            <div className="absolute inset-0 pointer-events-none">{/* Wrapper for full viewport positioning */}
              <>
                {/* Random notification 1 - top left */}
                <motion.div
                  initial={{ opacity: 0, y: -100, scale: 0.3 }}
                  animate={{ 
                    opacity: [0, 1, 1, 1, 0],
                    y: [-100, -80, -75, -75, -60],
                    scale: [0.3, 1.1, 1, 1, 0.9]
                  }}
                  transition={{ 
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 2,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute top-8 left-[2%] w-56 md:w-64 lg:w-72 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
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
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute top-8 right-[2%] w-56 md:w-64 lg:w-72 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
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
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 4,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute bottom-16 left-[2%] w-56 md:w-64 lg:w-72 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
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
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute bottom-16 right-[2%] w-56 md:w-64 lg:w-72 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
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
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 3.5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute top-[35%] left-[1%] w-52 md:w-60 lg:w-64 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
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
                    duration: 4.5,
                    times: [0, 0.15, 0.25, 0.75, 1],
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: Math.random() * 4.5,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  className="absolute top-[35%] right-[1%] w-52 md:w-60 lg:w-64 pointer-events-none z-20"
                  style={{ opacity: getSectionOpacity(5/8, 6/8) }}
                >
                  <Image
                    src="/notifications/notif6.png"
                    alt="Notification"
                    width={256}
                    height={80}
                    className="drop-shadow-2xl"
                  />
                </motion.div>
              </>
            </div>
          )}
        </div>

        {/* Section 7 - Reviews Section with Motion animations */}
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ 
            opacity: getSectionOpacity(6/8, 7/8),
            pointerEvents: scrollProgress >= 6/8 && scrollProgress < 7/8 ? 'auto' : 'none' 
          }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
            <motion.h2 
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white text-center mb-16 leading-[1.1]"
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                fontWeight: 600
              }}
            >
              Trusted
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  variants={reviewVariants}
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
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </motion.svg>
                      ))}
                    </div>
                  </motion.div>
                  <p 
                    className="text-white/90 text-sm md:text-base mb-4 leading-relaxed"
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
            </motion.div>
          </div>
        </div>

        {/* Section 8 - Completely Private */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ 
            opacity: scrollProgress >= 7/8 ? 1 : 0,
            pointerEvents: scrollProgress >= 7/8 ? 'auto' : 'none' 
          }}
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div 
              className="flex-1 text-center md:order-1 transition-all duration-1000 ease-out"
              style={{
                opacity: scrollProgress >= 7/8 ? gsap.utils.mapRange(7/8, 0.95, 0, 1, Math.min(scrollProgress, 0.95)) : 0,
                transform: `translateX(${scrollProgress >= 7/8 ? 0 : -30}px) scale(${scrollProgress >= 7/8 ? 1 : 0.95})`
              }}
            >
              <h2 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1]"
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
                  fontWeight: 600
                }}
              >
                Completely<br />Private
              </h2>
            </div>

            <div
              className="relative w-[220px] h-[490px] sm:w-[260px] sm:h-[570px] md:w-[300px] md:h-[650px] md:order-2 transition-all duration-1000 ease-out rounded-[32px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden"
              style={{
                opacity: scrollProgress >= 7/8 ? gsap.utils.mapRange(7/8, 0.95, 0, 1, Math.min(scrollProgress, 0.95)) : 0,
                transform: `scale(${scrollProgress >= 7/8 ? gsap.utils.mapRange(7/8, 0.95, 0.95, 1, Math.min(scrollProgress, 0.95)) : 0.95})`
              }}
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

            <div className="flex-1 md:order-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLanding;
