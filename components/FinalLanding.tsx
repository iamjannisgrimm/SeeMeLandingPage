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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 md:py-12 gap-6 md:gap-8">
        {/* Text Group */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Title */}
          <h1 
            className="font-black tracking-tight text-white mb-2 md:mb-3"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 900,
              fontSize: 'clamp(4rem, 12vw, 10rem)'
            }}
          >
            SeeMe
          </h1>

          {/* Subtitle */}
          <p 
            className="text-white/90 text-center px-4 whitespace-nowrap"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 400,
              fontSize: 'clamp(1rem, 2.5vw, 2rem)'
            }}
          >
            Your private AI for clarity, balance, and deeply personalized growth
          </p>
        </div>

        {/* Video Mockup Container */}
        <div
          className="relative rounded-[30px] border-4 border-white/30 bg-black shadow-2xl overflow-hidden flex-shrink-0"
          style={{
            width: '280px',
            height: '615px',
            minWidth: '280px',
            minHeight: '615px',
            maxHeight: 'calc(100vh - 300px)'
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
  );
};

export default FinalLanding;
