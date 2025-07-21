import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string | string[];
  loop?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  onEnded?: () => void;
  fallbackEmoji?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  loop = true,
  autoPlay = true,
  muted = true,
  className = '',
  onEnded,
  fallbackEmoji = '😊'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle both single video and array of videos
  const videoSources = Array.isArray(src) ? src : [src];
  const currentVideoSrc = videoSources[currentVideoIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      console.error('Video failed to load:', currentVideoSrc);
      setHasError(true);
      setIsLoading(false);
    };

    const handleEnded = () => {
      if (Array.isArray(src) && src.length > 1) {
        // Seamless transition to preloaded video
        const preloadVideo = preloadVideoRef.current;
        if (preloadVideo && preloadVideo.readyState >= 2) { // HAVE_CURRENT_DATA
          setIsTransitioning(true);
          
          // Swap the videos instantly
          const nextIndex = (currentVideoIndex + 1) % src.length;
          setCurrentVideoIndex(nextIndex);
          
          // Start the preloaded video immediately
          preloadVideo.currentTime = 0;
          preloadVideo.play().then(() => {
            setIsTransitioning(false);
          }).catch(console.error);
        } else {
          // Fallback to normal transition
          const nextIndex = (currentVideoIndex + 1) % src.length;
          setCurrentVideoIndex(nextIndex);
        }
      }
      
      // Always call onEnded when video finishes
      if (onEnded) {
        onEnded();
      }
    };

    const handleTimeUpdate = () => {
      // Only preload for multiple videos
      if (Array.isArray(src) && src.length > 1 && video.duration - video.currentTime < 0.5) {
        const nextIndex = (currentVideoIndex + 1) % src.length;
        const nextVideoSrc = src[nextIndex];
        const preloadVideo = preloadVideoRef.current;
        
        if (preloadVideo && preloadVideo.src !== nextVideoSrc) {
          preloadVideo.src = nextVideoSrc;
          preloadVideo.load();
        }
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentVideoSrc, currentVideoIndex, src, onEnded]);

  // Reset error state when src changes
  useEffect(() => {
    console.log('Loading video:', currentVideoSrc);
    setHasError(false);
    setIsLoading(true);
    setCurrentVideoIndex(0);
    setIsTransitioning(false);
  }, [src]);

  // Initialize preload video element
  useEffect(() => {
    if (Array.isArray(src) && src.length > 1) {
      const preloadVideo = preloadVideoRef.current;
      if (preloadVideo) {
        preloadVideo.muted = muted;
        preloadVideo.playsInline = true;
        preloadVideo.preload = 'auto';
      }
    }
  }, [src, muted]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <span style={{ fontSize: '4rem' }}>{fallbackEmoji}</span>
          <div className="text-xs text-gray-500 mt-2">Alexa</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-pp-surface rounded-lg">
          <div className="animate-pulse text-pp-accent1">Loading...</div>
        </div>
      )}
      
      {/* Main video */}
      <video
        ref={videoRef}
        src={currentVideoSrc}
        loop={!Array.isArray(src) || src.length === 1 ? loop : false} // Loop for single videos or single-item arrays
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        className="w-full h-full object-contain"
        style={{ 
          opacity: isLoading || isTransitioning ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
      
      {/* Hidden preload video for seamless transitions */}
      {Array.isArray(src) && src.length > 1 && (
        <video
          ref={preloadVideoRef}
          muted={muted}
          playsInline
          className="w-full h-full object-contain absolute inset-0"
          style={{ 
            opacity: isTransitioning ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            zIndex: isTransitioning ? 10 : -1
          }}
        />
      )}
    </div>
  );
};