import { useState, useRef, useCallback } from "react";
import { HeartIcon, CommentIcon, SaveIcon } from "../components/icons";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { AutoPlayVideo } from "../components/AutoPlayVideo";

export const Reels = () => {
  const { reels, toggleLike } = PostData();
  const { user } = UserData();

  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);

  const reel = reels[current];
  const isLiked = reel?.likes?.includes(user?._id);

  const handleLike = async (id) => await toggleLike(id);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / el.clientHeight);
    setCurrent(index);
  }

  const scrollToIndex = (i) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: "smooth" });
  }

  const goUp = () => current > 0 && scrollToIndex(current - 1);
  const goDown = () => current < reels.length - 1 && scrollToIndex(current + 1);

  return (
    <div className="bg-bg md:flex md:items-center md:justify-center overflow-hidden"
      style={{ height: "calc(100vh - 3.5rem)" }}
    >
      <div className="hidden md:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <NavButton onClick={goUp} disabled={current === 0} direction="up" />
        <NavButton onClick={goDown} disabled={current === reels.length - 1} direction="down" />
      </div>

      <div className="flex flex-row items-end gap-6 h-full md:h-[90vh]">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative w-full h-full md:w-auto md:aspect-9/16 overflow-y-scroll no-scrollbar md:rounded-xl shadow-2xl bg-surface snap-y snap-mandatory"
          style={{ scrollSnapType: "y mandatory" }}
        >
          {reels.map((r) => (
            <div key={r._id} className="w-full h-full snap-start relative">
              {r?.post ? (
                <AutoPlayVideo
                  src={r.post.url}
                  className="w-full h-full object-cover "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-bg">
                  <span className="text-[0.7rem] tracking-widest uppercase text-subtle">
                    no video
                  </span>
                </div>
              )}
              <div className="absolute bottom-9 left-5 z-10 flex flex-col gap-1 max-w-[calc(100%-5rem)]">
              <span className="text-sm font-medium text-text drop-shadow-md">
                @{r?.owner?.name}
              </span>
              {r?.caption && (
                <p className="text-[0.8rem] text-text leading-relaxed drop-shadow-md line-clamp-3">
                  <span className="font-medium tracking-wide">{r.caption}</span>
                </p>
              )}
            </div>
          </div>
        ))}

          <div className="absolute right-4 bottom-[env(safe-area-inset-bottom)] flex flex-col gap-6 md:hidden z-10">
            <ActionButton onClick={() => handleLike(reel._id)} count={reel?.likes?.length || 0} active={isLiked} icon={<HeartIcon filled={isLiked} isMobile />} />
            <ActionButton count={reel?.comments?.length || 0} icon={<CommentIcon isMobile />} />
            <ActionButton active={reel?.saved} icon={<SaveIcon filled={reel?.saved} isMobile />} />
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-8 pb-4">
          <ActionButton onClick={() => handleLike(reel._id)} count={reel?.likes?.length || 0} active={isLiked} icon={<HeartIcon filled={isLiked} />} label="likes" />
          <ActionButton count={reel?.comments?.length || 0} icon={<CommentIcon />} label="comments" />
          <ActionButton active={reel?.saved} icon={<SaveIcon filled={reel?.saved} />} label="save" />
        </div>
      </div>
    </div>
  );
};

function ActionButton({ onClick, count, active, icon, label }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center group cursor-pointer">
      <div className="transition-transform active:scale-90 duration-150">{icon}</div>
      {count !== undefined && (
        <span className={`text-[0.65rem] mt-1 font-medium md:text-text ${label ? "" : "text-text drop-shadow-md"}`}>
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
      className={`w-10 h-10 flex items-center justify-center rounded-full border border-border bg-text shadow-sm transition-all cursor-pointer
        ${disabled ? "opacity-20 cursor-not-allowed" : "hover:scale-110 active:bg-text"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
        <path d={direction === "up" ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"} />
      </svg>
    </button>
  );
}