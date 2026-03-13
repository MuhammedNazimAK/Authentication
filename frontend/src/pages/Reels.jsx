import { useState, useRef, useCallback } from "react";
import { HeartIcon, CommentIcon, SaveIcon } from "../components/icons";
import { postData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { AutoPlayVideo } from "../components/AutoPlayVideo";

export const Reels = () => {
  const { reels, toggleLike } = postData();
  const { user } = UserData();

  const [current, setCurrent] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartY = useRef(null);

  const reel = reels[current];
  const isLiked = reel?.likes?.includes(user?._id);

  const handleLike = async (id) => await toggleLike(id);

  // Drag / touch helpers 
  const onDragStart = useCallback((clientY) => {
    dragStartY.current = clientY;
    setIsDragging(true);
  }, []);

  const onDragMove = useCallback(
    (clientY) => {
      if (dragStartY.current === null) return;
      const delta = clientY - dragStartY.current;
      const atTop = current === 0;
      const atBottom = current === reels.length - 1;
      const clamped =
        atTop && delta > 0
          ? Math.min(delta * 0.3, 80)
          : atBottom && delta < 0
          ? Math.max(delta * 0.3, -80)
          : delta;
      setDragOffset(clamped);
    },
    [current, reels.length]
  );

  const onDragEnd = useCallback(
    (clientY) => {
      if (dragStartY.current === null) return;
      const delta = clientY - dragStartY.current;
      const threshold = 60;

      if (delta < -threshold && current < reels.length - 1) {
        setCurrent((p) => p + 1);
      } else if (delta > threshold && current > 0) {
        setCurrent((p) => p - 1);
      }

      setDragOffset(0);
      setIsDragging(false);
      dragStartY.current = null;
    },
    [current, reels.length]
  );

  // Touch events
  const onTouchStart = (e) => onDragStart(e.touches[0].clientY);
  const onTouchMove = (e) => onDragMove(e.touches[0].clientY);
  const onTouchEnd = (e) => onDragEnd(e.changedTouches[0].clientY);

  // Mouse events (desktop drag)
  const onMouseDown = (e) => {
    e.preventDefault();
    onDragStart(e.clientY);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => onDragMove(e.clientY);
  const onMouseUp = (e) => {
    onDragEnd(e.clientY);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  // Wheel / trackpad scroll
  const wheelAccum = useRef(0);
  const wheelTimer = useRef(null);

  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      wheelAccum.current += e.deltaY;

      clearTimeout(wheelTimer.current);
      const peekOffset = Math.max(-120, Math.min(120, -wheelAccum.current * 0.5));
      setDragOffset(peekOffset);

      wheelTimer.current = setTimeout(() => {
        if (wheelAccum.current > 80 && current < reels.length - 1) {
          setCurrent((p) => p + 1);
        } else if (wheelAccum.current < -80 && current > 0) {
          setCurrent((p) => p - 1);
        }
        wheelAccum.current = 0;
        setDragOffset(0);
      }, 120);
    },
    [current, reels.length]
  );

  const goUp = () => { if (current > 0) setCurrent((p) => p - 1); };
  const goDown = () => { if (current < reels.length - 1) setCurrent((p) => p + 1); };

  return (
    <div className="bg-[#FAF7F2] md:flex md:items-center md:justify-center overflow-hidden select-none"
      style={{ height: "calc(100vh - 3.5rem)" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      <div className="hidden md:flex fixed right-10 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <NavButton onClick={goUp} disabled={current === 0} direction="up" />
        <NavButton onClick={goDown} disabled={current === reels.length - 1} direction="down" />
      </div>

      <div className="flex flex-row items-end gap-6 h-full md:h-[90vh]">
        {/* viewport */}
        <div
          className="relative w-full h-full md:w-auto md:aspect-9/16 overflow-hidden md:rounded-xl shadow-2xl bg-black"
          onWheel={onWheel}
          style={{ touchAction: "none" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateY(calc(${-current * 100}% + ${dragOffset}px))`,
              transition: isDragging
                ? "none"
                : "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
              willChange: "transform",
            }}
          >
            {reels.map((r, i) => (
              <div
                key={r._id}
                style={{
                  position: "absolute",
                  top: `${i * 100}%`,
                  left: 0,
                  right: 0,
                  height: "100%",
                }}
              >
                {r?.post ? (
                  <AutoPlayVideo
                    src={r.post.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F0EBE1]">
                    <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#99968F]">
                      no video
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile action buttons */}
          <div className="absolute right-4 bottom-[env(safe-area-inset-bottom)] flex flex-col gap-6 md:hidden z-10">
            <ActionButton
              onClick={() => handleLike(reel._id)}
              count={reel?.likes?.length || 0}
              active={isLiked}
              icon={<HeartIcon filled={isLiked} isMobile />}
            />
            <ActionButton
              count={reel?.comments?.length || 0}
              icon={<CommentIcon isMobile />}
            />
            <ActionButton
              active={reel?.saved}
              icon={<SaveIcon filled={reel?.saved} isMobile />}
            />
          </div>

          {/* Username */}
          <div className="absolute bottom-9 left-5 z-10">
            <span className="text-sm font-medium text-white drop-shadow-md">
              @{reel?.owner?.name}
            </span>
          </div>
        </div>

        {/* Desktop action buttons */}
        <div className="hidden md:flex flex-col gap-8 pb-4">
          <ActionButton
            onClick={() => handleLike(reel._id)}
            count={reel?.likes?.length || 0}
            active={isLiked}
            icon={<HeartIcon filled={isLiked} />}
            label="likes"
          />
          <ActionButton
            count={reel?.comments?.length || 0}
            icon={<CommentIcon />}
            label="comments"
          />
          <ActionButton
            active={reel?.saved}
            icon={<SaveIcon filled={reel?.saved} />}
            label="save"
          />
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
        <span className={`text-[0.65rem] mt-1 font-medium md:text-[#99968F] ${label ? "" : "text-white drop-shadow-md"}`}>
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