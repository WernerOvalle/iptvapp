'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      if (Hls.isSupported()) {
        // Destroy previous HLS instance if it exists
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        // Create new HLS instance
        const hls = new Hls({
          enableWorker: true, // Enable web workers for better performance
          // Add reasonable timeout
          manifestLoadingTimeOut: 20000,
          manifestLoadingMaxRetry: 3
        });

        // Save HLS instance for cleanup
        hlsRef.current = hls;

        // Add error handling
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // Try to recover network error
                console.error('Network error', data);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                // Try to recover media error
                console.error('Media error', data);
                hls.recoverMediaError();
                break;
              default:
                // Cannot recover
                console.error('Fatal error', data);
                hls.destroy();
                break;
            }
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      }
    }

    // Cleanup HLS on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full"
      playsInline
      autoPlay // Add autoplay if desired
    />
  );
}