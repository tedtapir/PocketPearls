import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  src: string;
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      console.error('Video failed to load:', src);
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  // Reset error state when src changes
  useEffect(() => {
    console.log('Loading video:', src);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

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
        src={src}
        loop={loop}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        className="w-full h-full object-cover rounded-lg"
        onEnded={onEnded}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};