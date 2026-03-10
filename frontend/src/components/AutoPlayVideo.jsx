import { useEffect, useRef } from "react";

export const AutoPlayVideo = ({ src, shouldPause }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldPause) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.9 } // 90% of the video must be visible to play
    );

    if (videoRef.current) observer.observe(videoRef.current);

    if (shouldPause) {
      videoRef.current?.pause();
    } else if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    }

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [shouldPause]);

  return (
    <video
      ref={videoRef}
      src={src}
      className="w-full h-full object-contain"
      muted // Required for autoplay to work on most browsers
      loop
      playsInline // Required for mobile autoplay
    />
  );
};