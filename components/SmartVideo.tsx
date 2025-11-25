'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface SmartVideoProps {
  src: string;
  priority?: boolean; // If true, load immediately (for hero)
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  poster?: string; // Optional poster image
}

// Global video cache to track loaded videos
const videoCache = new Map<string, boolean>();
const loadingPromises = new Map<string, Promise<void>>();

// Preload a video and cache it
export const preloadVideo = (src: string): Promise<void> => {
  if (videoCache.has(src)) {
    return Promise.resolve();
  }
  
  if (loadingPromises.has(src)) {
    return loadingPromises.get(src)!;
  }
  
  const promise = new Promise<void>((resolve) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    
    const handleLoaded = () => {
      videoCache.set(src, true);
      loadingPromises.delete(src);
      resolve();
    };
    
    video.addEventListener('canplaythrough', handleLoaded, { once: true });
    video.addEventListener('loadeddata', handleLoaded, { once: true });
    video.addEventListener('error', () => {
      // Still mark as "loaded" to prevent blocking
      videoCache.set(src, true);
      loadingPromises.delete(src);
      resolve();
    }, { once: true });
    
    video.src = src;
    video.load();
  });
  
  loadingPromises.set(src, promise);
  return promise;
};

// Preload multiple videos in sequence (priority first, then others)
export const preloadVideosSequentially = async (
  priorityVideos: string[],
  otherVideos: string[]
): Promise<void> => {
  // Load priority videos first (in parallel)
  await Promise.all(priorityVideos.map(preloadVideo));
  
  // Then load others one by one to not overwhelm bandwidth
  for (const src of otherVideos) {
    await preloadVideo(src);
  }
};

const SmartVideo: React.FC<SmartVideoProps> = ({
  src,
  priority = false,
  className = '',
  style = {},
  onLoad,
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(videoCache.has(src));
  const [isVisible, setIsVisible] = useState(priority);
  const [hasError, setHasError] = useState(false);

  // Intersection observer for lazy loading non-priority videos
  useEffect(() => {
    if (priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '200px', // Start loading 200px before visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load video when visible
  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      videoCache.set(src, true);
      onLoad?.();
      
      // Try to play with exponential backoff
      const tryPlay = (attempts = 0) => {
        video.play().catch(() => {
          if (attempts < 3) {
            setTimeout(() => tryPlay(attempts + 1), 100 * (attempts + 1));
          }
        });
      };
      tryPlay();
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true); // Don't block UI
      onLoad?.();
    };

    video.addEventListener('canplaythrough', handleCanPlay, { once: true });
    video.addEventListener('loadeddata', handleCanPlay, { once: true });
    video.addEventListener('error', handleError, { once: true });

    // Start loading
    video.load();

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isVisible, isLoaded, src, onLoad]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden"
          style={style}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
          <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-900 flex items-center justify-center"
          style={style}
        >
          <span className="text-white/50 text-sm">Video unavailable</span>
        </div>
      )}
      
      {/* Actual video - only render source when visible */}
      <video
        ref={videoRef}
        className={`${className} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? 'metadata' : 'none'}
        poster={poster}
      >
        {isVisible && <source src={src} type="video/webm" />}
      </video>
    </div>
  );
};

export default SmartVideo;
