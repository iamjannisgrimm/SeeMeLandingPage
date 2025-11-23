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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8 py-8 md:py-12 gap-8 md:gap-10">
        {/* Text Group */}
        <div className="flex flex-col items-center flex-shrink-0">
          {/* Title */}
          <h1 
            className="font-black tracking-tight text-white"
            style={{ 
              fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', 
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 10vw, 8rem)',
              marginBottom: '0.5rem'
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
            minWidth: '240px',
            minHeight: '528px',
            maxHeight: 'calc(100vh - 300px)',
            marginTop: '1rem'
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
