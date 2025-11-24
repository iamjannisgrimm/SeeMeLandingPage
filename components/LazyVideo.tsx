'use client';

import React, { useRef, useEffect, useState } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  style = {},
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsInView(true);
            setHasLoaded(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const currentVideo = videoRef.current;
    if (currentVideo) {
      observer.observe(currentVideo);
    }

    return () => {
      if (currentVideo) {
        observer.unobserve(currentVideo);
      }
    };
  }, [hasLoaded]);

  useEffect(() => {
    if (isInView && videoRef.current && !isLoaded) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setIsLoaded(true);
        // Force autoplay with multiple attempts
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Video autoplay successful');
          }).catch(error => {
            console.log('Autoplay failed, trying muted play:', error);
            // Fallback: ensure muted and try again
            video.muted = true;
            video.play().catch(e => console.log('Muted autoplay also failed:', e));
          });
        }
      };

      // Also try to play on loadeddata as fallback
      const handleLoadedData = () => {
        if (!isLoaded) {
          video.play().catch(console.error);
        }
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.load();

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [isInView, isLoaded]);

  return (
    <div className="relative w-full h-full">
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-900 flex items-center justify-center"
          style={style}
        >
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        poster={poster}
        preload="none"
      >
        {isInView && (
          <>
            <source src={src} type={src.includes('.webm') ? 'video/webm' : 'video/mp4'} />
          </>
        )}
      </video>
    </div>
  );
};

export default LazyVideo;
