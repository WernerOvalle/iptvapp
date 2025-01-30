'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
}
interface FullScreenElement extends HTMLVideoElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}
export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<FullScreenElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const enterFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenEnabled && videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((error) => {
            console.log("Video autoplay failed:", error);
          });
        });

        video.addEventListener('play', enterFullscreen);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch((error) => {
            console.log("Video autoplay failed:", error);
          });
        });
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
        }
        video.removeEventListener('play', enterFullscreen);
      };
    }
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