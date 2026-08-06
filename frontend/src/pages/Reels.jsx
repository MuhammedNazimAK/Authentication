import { useState, useRef, useCallback } from "react";
import { HeartIcon, CommentIcon, SaveIcon } from "../components/icons";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { AutoPlayVideo } from "../components/AutoPlayVideo";
import { Link } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns"

export const Reels = () => {
  const { reels, toggleLike } = PostData();
  const { user } = UserData();

  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

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

      <div className="relative flex flex-row items-end gap-6 h-full md:h-[90vh]">
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
                <Link to={`/profile/${r.owner?._id}`}>
                  <span className="text-sm font-medium text-text drop-shadow-md">
                    @{r?.owner?.name}
                  </span>
                </Link>
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
            <ActionButton onClick={() => setModalOpen((prev) => !prev)} count={reel?.comments?.length || 0} icon={<CommentIcon isMobile />} />
            <ActionButton active={reel?.saved} icon={<SaveIcon filled={reel?.saved} isMobile />} />
          </div>
        </div>

        <div className="hidden md:flex flex-col gap-8 pb-4">
          <ActionButton onClick={() => handleLike(reel._id)} count={reel?.likes?.length || 0} active={isLiked} icon={<HeartIcon filled={isLiked} />} label="likes" />
          <ActionButton onClick={() => setModalOpen((prev) => !prev)} count={reel?.comments?.length || 0} icon={<CommentIcon />} label="comments" />
          <ActionButton active={reel?.saved} icon={<SaveIcon filled={reel?.saved} />} label="save" />
        </div>

        {modalOpen && (
          <CommentModal reel={reel} onClose={() => setModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

function CommentModal({ reel, onClose }) {
  const [comment, setComment] = useState("");
  const { addComment } = PostData();

  const handleAddComment = async () => {
    await addComment(reel._id, comment, setComment);
  }
  const hasComment = comment.trim().length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      <div
        className="fixed inset-x-0 bottom-0 z-50 h-[70vh] rounded-t-2xl bg-surface border-t border-border flex flex-col overflow-hidden transition-all
                  md:absolute md:inset-x-auto md:top-auto md:bottom-0 md:translate-y-0 md:left-1/2 md:-translate-x-1/2 md:w-100 md:h-[70vh] md:rounded-t-xl md:border-x md:shadow-2xl
                  xl:left-full xl:translate-x-4 xl:w-87.5 xl:h-[70vh] xl:rounded-xl xl:border"
      >
        <div className="relative p-4 border-b border-border flex items-center">
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-border cursor-pointer z-10"
          >
            <CloseIcon />
          </button>
          <h3 className="absolute inset-x-0 text-center text-sm font-semibold text-text">Comments</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {reel?.comments?.map((c) => (
            <div key={c._id || c.id} className="flex gap-2.5">
              <Avatar
                id={c.user?._id}
                avatar={c.user?.profilePic?.url}
                user={c.user?.name}
                size="sm"
              />
              <div className="flex-1">
                <p className="text-[0.78rem] text-text leading-relaxed">
                  <Link to={`/profile/${c.user?._id}`}>
                    <span className="font-medium mr-1.5">{c.user?.name}</span>
                  </Link>
                  <span className="text-muted">{c.comment}</span>
                </p>
                {c.createdAt && (
                  <span className="text-[0.62rem] tracking-[0.08em] text-subtle mt-0.5 block">
                    {formatDistanceToNow(parseISO(c.createdAt), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center gap-3 bg-surface">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-[0.8rem] text-text placeholder:text-subtle outline-none"
          />
          <button
            onClick={handleAddComment}
            disabled={!hasComment}
            className={`text-[0.7rem] tracking-widest uppercase font-medium transition-colors duration-200 ${
              hasComment
                ? "text-text cursor-pointer hover:underline"
                : "text-muted opacity-50 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </div>
    </>
  )
}

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

function Avatar({ avatar, user, size = "md", dark = false, id }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const text = size === "sm" ? "text-[0.5rem]" : "text-[0.55rem]";
  return (
    <div className={`${dim} rounded-full ${dark ? "bg-surface border-white/20" : "bg-bg border-border"} border overflow-hidden shrink-0`}>
      {avatar ? (
        <Link to={`/profile/${id}`}>
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
        </Link>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`${text} tracking-widest uppercase ${dark ? "text-white/50" : "text-subtle"}`}>{user?.[0]}</span>
        </div>
      )}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}