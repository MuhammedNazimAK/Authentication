import { useState } from "react";

const mockReels = [
  { id: 1, user: "jane.doe", videoUrl: "https://v1.pinimg.com/videos/mc/720p/f6/15/8e/f6158e379b1836a992850942d99d3d92.mp4", thumbnail: "", likes: 412, comments: 38, saved: false, liked: false },
  { id: 2, user: "john.smith", videoUrl: "https://v1.pinimg.com/videos/mc/720p/f6/15/8e/f6158e379b1836a992850942d99d3d92.mp4", thumbnail: "", likes: 891, comments: 74, saved: false, liked: false },
];

export const Reels = () => {
  const [reels, setReels] = useState(mockReels);
  const [current, setCurrent] = useState(0);

  const handleLike = (id) => {
    setReels((p) => p.map((r) => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };
  const handleSave = (id) => {
    setReels((p) => p.map((r) => r.id === id ? { ...r, saved: !r.saved } : r));
  };

  const goUp = () => setCurrent((p) => Math.max(0, p - 1));
  const goDown = () => setCurrent((p) => Math.min(reels.length - 1, p + 1));

  const reel = reels[current];

  return (
    <div className="h-[100dvh] bg-[#FAF7F2] md:flex md:items-center md:justify-center overflow-hidden">
      
      {/* ── 1. Desktop Nav Arrows (Far Right) ── */}
      <div className="hidden md:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <NavButton onClick={goUp} disabled={current === 0} direction="up" />
        <NavButton onClick={goDown} disabled={current === reels.length - 1} direction="down" />
      </div>

      <div className="flex flex-row items-end gap-6 h-full md:h-[90vh]">
        
        {/* ── 2. Reel Container ── */}
        <div className="relative w-full h-full md:w-auto md:aspect-[9/16] bg-black md:rounded-xl overflow-hidden shadow-2xl">
          {reel.videoUrl ? (
            <video
              key={reel.id}
              src={reel.videoUrl}
              autoPlay loop muted playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F0EBE1]">
               <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#99968F]">no video</span>
            </div>
          )}

          {/* ── 3. Mobile Actions (Inside Reel) ── */}
          <div className="absolute right-4 bottom-24 flex flex-col gap-6 md:hidden z-10">
            <ActionButton 
                onClick={() => handleLike(reel.id)} 
                count={reel.likes} active={reel.liked} 
                icon={<HeartIcon filled={reel.liked} isMobile />} 
            />
            <ActionButton 
                count={reel.comments} 
                icon={<CommentIcon isMobile />} 
            />
            <ActionButton 
                onClick={() => handleSave(reel.id)} 
                active={reel.saved} 
                icon={<SaveIcon filled={reel.saved} isMobile />} 
            />
          </div>

          {/* User Info Overlay */}
          <div className="absolute bottom-6 left-5 z-10">
            <span className="text-sm font-medium text-white drop-shadow-md">@{reel.user}</span>
            <p className="text-xs text-white/80 mt-1 line-clamp-1">Original Audio — {reel.user}</p>
          </div>

          {/* Dark gradient for text visibility */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* ── 4. Desktop Actions (Outside Reel) ── */}
        <div className="hidden md:flex flex-col gap-8 pb-4">
          <ActionButton 
            onClick={() => handleLike(reel.id)} 
            count={reel.likes} active={reel.liked} 
            icon={<HeartIcon filled={reel.liked} />} 
            label="likes" 
          />
          <ActionButton 
            count={reel.comments} 
            icon={<CommentIcon />} 
            label="comments" 
          />
          <ActionButton 
            onClick={() => handleSave(reel.id)} 
            active={reel.saved} 
            icon={<SaveIcon filled={reel.saved} />} 
            label="save" 
          />
        </div>

      </div>
    </div>
  );
}

function ActionButton({ onClick, count, active, icon, label }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group cursor-pointer">
      <div className="transition-transform active:scale-90 duration-150">
        {icon}
      </div>
      {count !== undefined && (
        <span className={`text-[0.65rem] mt-1 font-medium md:text-[#99968F] ${label ? '' : 'text-white drop-shadow-md'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function NavButton({ onClick, disabled, direction }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#DDD8CF] bg-[#FDFBF8] shadow-sm transition-all
        ${disabled ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:bg-[#F0EBE1]"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d={direction === "up" ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
      </svg>
    </button>
  );
}

function HeartIcon({ filled, isMobile }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? (isMobile ? "#FF3040" : "#111") : "none"} stroke={isMobile ? "white" : "#111"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon({ isMobile }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isMobile ? "white" : "#99968F"} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SaveIcon({ filled, isMobile }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? (isMobile ? "white" : "#111") : "none"} stroke={isMobile ? "white" : "#111"} strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

