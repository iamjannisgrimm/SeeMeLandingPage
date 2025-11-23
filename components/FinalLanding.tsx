'use client';

import React from 'react';
import Image from 'next/image';

const FinalLanding = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Image
          src="/backgrounds/backg1.png"
          alt="Background"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 w-full h-full bg-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center h-full px-4 md:px-8 pt-16 md:pt-20">
        {/* Text Group - positioned to balance space */}
        <div className="flex flex-col items-center mb-auto">
          {/* Title */}
          <h1 
            className="text-8xl sm:text-9xl md:text-[140px] lg:text-[180px] xl:text-[200px] font-black tracking-tight text-white mb-2 md:mb-3"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 900
            }}
          >
            SeeMe
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 text-center px-4 whitespace-nowrap"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 400
            }}
          >
            Your private AI for clarity, balance, and deeply personalized growth
          </p>
        </div>

        {/* Video Mockup Container - stays centered */}
        <div
          className="relative w-[280px] h-[615px] rounded-[30px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden mb-auto"
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
  );
};

export default FinalLanding;
