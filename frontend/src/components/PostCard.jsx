import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon, CommentIcon, SaveIcon } from "./icons";
import { AutoPlayVideo } from "./AutoPlayVideo";

const DUMMY_COMMENTS = [
  { id: 1, user: "sofia.m", avatar: "", text: "absolutely stunning 🤍", timestamp: "2h" },
  { id: 2, user: "kai.writes", avatar: "", text: "the light here is incredible", timestamp: "3h" },
  { id: 3, user: "nour.a", avatar: "", text: "where is this?? need to visit", timestamp: "5h" },
  { id: 4, user: "elena.v", avatar: "", text: "this is everything 🖤", timestamp: "6h" },
  { id: 5, user: "marc.d", avatar: "", text: "your feed never misses", timestamp: "8h" },
  { id: 6, user: "priya.k", avatar: "", text: "obsessed with this shot", timestamp: "10h" },
];


export const PostCard = ({ post, currentUser }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [saved, setSaved] = useState(post.saved ?? false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const handleMediaClick = () => {
    const isMobile = window.innerWidth < 768;

    if (post.type === "reel" && isMobile) {
      navigate("/reels");
    } else {
      setModalOpen(true);
    }
  };

  const toggleLike = () => {
    setLiked((p) => !p);
    setLikes((p) => liked ? p - 1 : p + 1);
  };

  const isOwnPost = currentUser === post.user;

  return (
    <>
      <article className="bg-[#FDFBF8] border-b border-[#DDD8CF]">
        <PostHeader user={post.owner?.name} avatar={post.owner?.profilePic?.url} isOwn={isOwnPost} />

        <div className="aspect-square w-full bg-[#050505] overflow-hidden"
          onClick={handleMediaClick}
          >
          {post.post?.url ? (
            post.type === "reel" ? (
              <AutoPlayVideo 
                src={post.post.url} 
                className="w-full h-full object-contain" 
                muted 
                loop 
                playsInline
                shouldPause={modalOpen}
              />
            ) : (
              <img src={post.post.url} alt="" className="w-full h-full object-contain" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[0.65rem] tracking-[0.16em] uppercase text-[#99968F]">no media</span>
            </div>
          )}
        </div>

        <div className="px-3 pt-3 pb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={toggleLike} className="flex items-center gap-1.5 cursor-pointer">
                <HeartIcon filled={liked} />
                <span className="text-[0.7rem] tracking-[0.06em] text-[#555550]">{likes}</span>
              </button>
              <button onClick={() => setModalOpen(true)} className="flex items-center gap-1.5 cursor-pointer">
                <CommentIcon />
                <span className="text-[0.7rem] tracking-[0.06em] text-[#555550]">{DUMMY_COMMENTS.length}</span>
              </button>
            </div>
            <button onClick={() => setSaved((p) => !p)} className="cursor-pointer">
              <SaveIcon filled={saved} />
            </button>
          </div>

          {post.caption && (
            <p className="text-[0.8rem] text-[#111] leading-relaxed">
              <span className="font-medium tracking-wide">{post.user}</span>{" "}
              <span className="text-[#333]">
                {post.caption.length > 100 && !isCaptionExpanded
                  ? `${post.caption.substring(0, 100)}... `
                  : post.caption}
                {post.caption.length > 100 && !isCaptionExpanded && (
                  <button
                    onClick={() => setIsCaptionExpanded(true)}
                    className="text-[#555550] font-medium cursor-pointer hover:underline"
                  >
                    read more
                  </button>
                )}
              </span>
            </p>
          )}

          {post.timestamp && (
            <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[#99968F]">{post.timestamp}</p>
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
    const videoRef = useRef(null);
  

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/15" onClick={onClose} />

      <div className="relative w-full md:max-w-7xl md:h-[88vh] bg-[#FDFBF8] md:rounded-xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[92dvh]">

        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full bg-[#F0EBE1] cursor-pointer md:hidden">
          <CloseIcon />
        </button>
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-7 h-7 items-center justify-center rounded-full bg-[#F0EBE1] cursor-pointer hidden md:flex">
          <CloseIcon />
        </button>

        {/* Left — media */}
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
                <div className="w-full h-full bg-[#F0EBE1] flex items-center justify-center">
                  <span className="text-[0.65rem] tracking-[0.16em] uppercase text-[#99968F]">no image</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right — comments */}
        {post.type ? (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-4 py-3 border-b border-[#DDD8CF] flex items-center gap-2.5">
              <Avatar avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
              <span className="text-[0.78rem] font-medium text-[#111] tracking-wide">{post.owner?.name}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {post.caption && (
                <div className="flex gap-2.5">
                  <Avatar avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
                  <div>
                    <p className="text-[0.78rem] text-[#111] leading-relaxed">
                      <span className="font-medium">{post.owner?.name}</span>{" "}
                      <span className="text-[#333]">{post.caption}</span>
                    </p>
                    <span className="text-[0.62rem] tracking-[0.08em] uppercase text-[#99968F] mt-0.5 block">{post.timestamp}</span>
                  </div>
                </div>
              )}

              {DUMMY_COMMENTS.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar avatar={c.avatar} user={c.user} size="sm" />
                  <div>
                    <p className="text-[0.78rem] text-[#111] leading-relaxed">
                      <span className="font-medium">{c.user}</span>{" "}
                      <span className="text-[#333]">{c.text}</span>
                    </p>
                    <span className="text-[0.62rem] tracking-[0.08em] uppercase text-[#99968F] mt-0.5 block">{c.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-[#DDD8CF] flex items-center gap-3">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment…"
                className="flex-1 bg-transparent text-[0.8rem] text-[#111] placeholder:text-[#99968F] outline-none"
              />
              {comment.trim() && (
                <button
                  onClick={() => setComment("")}
                  className="text-[0.7rem] tracking-[0.1em] uppercase text-[#111] font-medium cursor-pointer"
                >
                  Post
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center gap-3 p-8">
            <span className="text-[0.7rem] tracking-[0.16em] uppercase text-[#99968F]">View full reel</span>
            <button
              onClick={() => { onClose(); navigate("/reels"); }}
              className="bg-[#111] text-[#FAF7F2] px-6 py-2.5 rounded text-[0.72rem] tracking-[0.14em] uppercase cursor-pointer"
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
          <span className="text-[0.78rem] font-medium text-[#111] tracking-wide leading-tight">{user}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isOwn && (
          <button className="text-[0.65rem] tracking-[0.14em] uppercase text-[#111] border border-[#DDD8CF] px-2.5 py-1 rounded cursor-pointer hover:bg-[#F0EBE1] transition-colors">
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
    <div className={`${dim} rounded-full ${dark ? "bg-[#333] border-white/20" : "bg-[#F0EBE1] border-[#DDD8CF]"} border overflow-hidden flex-shrink-0`}>
      {avatar ? (
        <img src={avatar} alt={user} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className={`${text} tracking-widest uppercase ${dark ? "text-white/50" : "text-[#99968F]"}`}>{user?.[0]}</span>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2">
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