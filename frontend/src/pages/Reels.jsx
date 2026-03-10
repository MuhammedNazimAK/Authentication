import { useState } from "react";
import { HeartIcon, CommentIcon, SaveIcon } from "../components/icons";
import { postData } from "../context/PostContext";

export const Reels = () => {
  const { reels, toggleLike } = postData();
  const [current, setCurrent] = useState(0);
  const reel = reels[current];

  const handleLike = async (id) => {
    console.log("Liking post with ID: in reels.jsx", id);
    await toggleLike(id);
  };

  const handleSave = (id) => {
    setReels((p) => p.map((r) => r.id === id ? { ...r, saved: !r.saved } : r));
  };

  const goUp = () => setCurrent((p) => Math.max(0, p - 1));
  const goDown = () => setCurrent((p) => Math.min(reels.length - 1, p + 1));


  return (
    <div className="h-[100dvh] bg-[#FAF7F2] md:flex md:items-center md:justify-center overflow-hidden">
      
      <div className="hidden md:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <NavButton onClick={goUp} disabled={current === 0} direction="up" />
        <NavButton onClick={goDown} disabled={current === reels.length - 1} direction="down" />
      </div>

      <div className="flex flex-row items-end gap-6 h-full md:h-[90vh]">
        
        <div className="relative w-full h-full md:w-auto md:aspect-[9/16] bg-black md:rounded-xl overflow-hidden shadow-2xl">
          {reel.post.url ? (
            <video
              key={reel._id}
              src={reel.post.url}
              autoPlay loop muted playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#F0EBE1]">
               <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#99968F]">no video</span>
            </div>
          )}

          <div className="absolute right-4 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] flex flex-col gap-6 md:hidden z-10">
            <ActionButton 
                onClick={() => handleLike(reel._id)} 
                count={reel?.likes?.length} active={reel?.liked}
                icon={<HeartIcon filled={reel?.liked} isMobile />} 
            />
            <ActionButton 
                count={reel?.comments?.length} 
                icon={<CommentIcon isMobile />} 
            />
            <ActionButton 
                onClick={() => handleSave(reel._id)} 
                active={reel?.saved} 
                icon={<SaveIcon filled={reel?.saved} isMobile />} 
            />
          </div>

          <div className="absolute env(safe-area-inset-bottom) left-5 z-10">
            <span className="text-sm font-medium text-white drop-shadow-md">@{reel?.owner?.name}</span>
            <p className="text-xs text-white/80 mt-1 line-clamp-1">Original Audio — {reel?.owner?.name}</p>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        <div className="hidden md:flex flex-col gap-8 pb-4">
          <ActionButton 
            onClick={() => handleLike(reel._id)} 
            count={reel.likes.length} active={reel.liked} 
            icon={<HeartIcon filled={reel.liked} />} 
            label="likes" 
          />
          <ActionButton 
            count={reel.comments.length} 
            icon={<CommentIcon />} 
            label="comments" 
          />
          <ActionButton 
            onClick={() => handleSave(reel._id)} 
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

