import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export const AutoPlayVideo = ({ src, shouldPause, className, defaultMuted = true, onVideoClick }) => {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [muted, setMuted] = useState(defaultMuted);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.7 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

    useEffect(() => {
    if (!isVisible) setUserPaused(false);
  }, [isVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = isVisible && !shouldPause && !userPaused;
    if (!shouldPlay) {
      video.pause();
      return
    }
  
    video.play().catch(() => {
      if (!video.muted) {
        video.muted = true;
        setMuted(true);
        video.play().catch(() => {});
      }
    });
  }, [isVisible, shouldPause, userPaused]);

  const handleVideoClick = () => {
    if (onVideoClick) {
      onVideoClick();
    } else {
      setUserPaused((p) => !p);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  return (
    <div className="relative w-full h-full">
    <video
      ref={videoRef}
      src={src}
      className={className}
      loop
      playsInline
      muted={muted}
      onClick={handleVideoClick}
    />
    <button
    onClick={toggleMute}
    className="absolute bottom-3 right-3 z-10 bg-black/50 rounded-full p-2"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};