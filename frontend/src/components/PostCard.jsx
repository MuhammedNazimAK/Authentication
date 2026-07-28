import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon, CommentIcon, SaveIcon } from "./icons";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";

export const PostCard = ({ post, currentUser }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(post.saved ?? false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const { toggleLike } = PostData();
  const { user } = UserData();

  const isLiked = post.likes?.includes(user?._id);

  const handleLike = async (id) => await toggleLike(id);

  const handleMediaClick = () => {
    const isMobile = window.innerWidth < 768;

    if (post.type === "reel" && isMobile) {
      navigate("/reels");
    } else {
      setModalOpen(true);
    }
  };

  const isOwnPost = currentUser === post.user;

  return (
    <>
      <article className="bg-bg border-b border-border">
        <PostHeader user={post.owner?.name} avatar={post.owner?.profilePic?.url} isOwn={isOwnPost} />

        <div className="aspect-square w-full bg-surface overflow-hidden"
          onClick={handleMediaClick}
          >
          {post.post?.url ? (
            post.type === "reel" ? (
              <AutoPlayVideo 
                src={post.post.url}
                className="w-full h-full object-contain" 
                shouldPause={modalOpen}
                onVideoClick={handleMediaClick}
              />
            ) : (
              <img src={post.post.url} alt="" className="w-full h-full object-contain" onClick={handleMediaClick} />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[0.65rem] tracking-widest uppercase text-subtle">no media</span>
            </div>
          )}
        </div>

        <div className="px-3 pt-3 pb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 cursor-pointer">
                <HeartIcon filled={isLiked} />
                <span className="text-[0.7rem] tracking-wider text-text w-4 text-left">{post.likes.length}</span>
              </button>
              <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 cursor-pointer">
                <CommentIcon />
                <span className="text-[0.7rem] tracking-wider text-text">{post.comments.length}</span>
              </button>
            </div>
            <button onClick={() => setSaved((p) => !p)} className="cursor-pointer">
              <SaveIcon filled={saved} />
            </button>
          </div>

          {post.caption && (
            <p className="text-[0.8rem] text-text leading-relaxed">
              <span className="font-medium tracking-wide">{post.user}</span>{" "}
              <span className="text-text">
                {post.caption.length > 100 && !isCaptionExpanded
                  ? `${post.caption.substring(0, 100)}... `
                  : post.caption}
                {post.caption.length > 100 && !isCaptionExpanded && (
                  <button
                    onClick={() => setIsCaptionExpanded(true)}
                    className="text-subtle font-medium cursor-pointer hover:underline"
                  >
                    read more
                  </button>
                )}
              </span>
            </p>
          )}

          {post.timestamp && (
            <p className="text-[0.65rem] tracking-widest uppercase text-subtle">{post.timestamp}</p>
          )}
        </div>
      </article>

      {modalOpen && (
        <PostModal post={post} onClose={() => setModalOpen(false)} type={post.type} />
      )}
    </>
  );
};

function PostModal({ post, onClose, type }) {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const { addComment } = PostData();

    const handleAddComment = async () => {
      await addComment(post._id, comment, setComment);
    }

    const videoRef = useRef(null);
    const hasComment = comment.trim().length > 0;

    function timeAgo(date) {
      const seconds = Math.floor(
          (new Date() - new Date(date)) / 1000
      );

      if (seconds < 60) return "just now";

      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;

      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;

      const days = Math.floor(hours / 24);
      return `${days}d ago`;
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-full md:max-w-7xl md:h-[88vh] bg-surface md:rounded-xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[92dvh]">
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-7 h-7 items-center justify-center rounded-full bg-surface border border-border hover:bg-border cursor-pointer hidden md:flex">
          <CloseIcon />
        </button>

        <div className="hidden md:block md:w-[70%] bg-black">
          {type === "reel" ? (
            <div className="aspect-square md:h-full md:aspect-auto relative">
              {post.post?.url ? (
                <video src={post.post?.url} loop autoPlay playsInline onClick={(e) =>
                      {
                      const video = e.currentTarget;
                      video.paused ? video.play() : video.pause();
                    }}
                    className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#1a1a1a]" />
              )}
            </div>
          ) : (
            <div className="aspect-square md:h-full md:aspect-auto">
              {post.post ? (
                <img src={post.post.url} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <span className="text-[0.65rem] tracking-[0.16em] uppercase text-subtle">no image</span>
                </div>
              )}
            </div>
          )}
        </div>

        {post.type ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
              <Avatar avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
              <span className="text-[0.78rem] font-medium text-text tracking-wide">{post.owner?.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
              {post.caption && (
                <div className="flex gap-2.5">
                  <Avatar avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
                  <div>
                    <p className="text-[0.78rem] text-text leading-relaxed">
                      <span className="font-medium">{post.owner?.name}</span>{" "}
                      <span className="text-muted">{post.caption}</span>
                    </p>
                    <span className="text-[0.62rem] tracking-[0.08em] uppercase text-subtle mt-0.5 block">{post.timestamp}</span>
                  </div>
                </div>
              )}

              {post.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar avatar={c.user?.profilePic?.url} user={c.user?.user} size="sm" />
                  <div>
                    <p className="text-[0.78rem] text-text leading-relaxed">
                      <span className="font-medium">{c.user?.name}</span>{" "}
                      <span className="text-muted">{c.comment}</span>
                    </p>
                    <span className="text-[0.62rem] tracking-[0.08em] text-subtle mt-0.5 block">{timeAgo(c.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-border flex items-center gap-3">
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
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center gap-3 p-8">
            <span className="text-[0.7rem] tracking-[0.16em] uppercase text-subtle">View full reel</span>
            <button
              onClick={() => { onClose(); navigate("/reels"); }}
              className="bg-surface text-text px-6 py-2.5 rounded text-[0.72rem] tracking-[0.14em] uppercase cursor-pointer"
            >
              Watch in Reels
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PostHeader({ user, avatar, isOwn }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Avatar avatar={avatar} user={user} />
        <div className="flex flex-col">
          <span className="text-[0.78rem] font-medium text-text tracking-wide leading-tight">{user}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isOwn && (
          <button className="text-[0.65rem] tracking-widest uppercase text-text border border-border px-2.5 py-1 rounded cursor-pointer hover:bg-surface transition-colors">
            Follow
          </button>
        )}
        <button className="p-1 cursor-pointer">
          <MoreIcon />
        </button>
      </div>
    </div>
  );
}

function Avatar({ avatar, user, size = "md", dark = false }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const text = size === "sm" ? "text-[0.5rem]" : "text-[0.55rem]";
  return (
    <div className={`${dim} rounded-full ${dark ? "bg-surface border-white/20" : "bg-bg border-border"} border overflow-hidden shrink-0`}>
      {avatar ? (
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`${text} tracking-widest uppercase ${dark ? "text-white/50" : "text-subtle"}`}>{user?.[0]}</span>
        </div>
      )}
    </div>
  );
}

function MoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#99968F">
      <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}