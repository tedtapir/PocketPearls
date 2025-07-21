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
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
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
        // Move to next video in sequence
        const nextIndex = (currentVideoIndex + 1) % src.length;
        setCurrentVideoIndex(nextIndex);
      } else if (onEnded) {
        onEnded();
      }
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoSrc, currentVideoIndex, src, onEnded]);

  // Reset error state when src changes
  useEffect(() => {
    console.log('Loading video:', currentVideoSrc);
    setHasError(false);
    setIsLoading(true);
    setCurrentVideoIndex(0);
  }, [src]);

  // Preload next video for seamless transition
  useEffect(() => {
    if (Array.isArray(src) && src.length > 1) {
      const nextIndex = (currentVideoIndex + 1) % src.length;
      const nextVideoSrc = src[nextIndex];
      
      // Create a hidden video element to preload the next video
      const preloadVideo = document.createElement('video');
      preloadVideo.src = nextVideoSrc;
      preloadVideo.preload = 'auto';
      preloadVideo.style.display = 'none';
      document.body.appendChild(preloadVideo);
      
      return () => {
        document.body.removeChild(preloadVideo);
      };
    }
  }, [currentVideoIndex, src]);

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
      <video
        ref={videoRef}
        src={currentVideoSrc}
        loop={!Array.isArray(src) && loop} // Only loop if it's a single video
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        className="w-full h-full object-cover"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};