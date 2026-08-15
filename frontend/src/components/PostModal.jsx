import { Link, useNavigate } from "react-router-dom";
import { PostData } from "../context/PostContext";
import { useState } from "react";
import { MoreIcon, CloseIcon } from "../components/icons";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { Dropdown } from "./Dropdown";

export const PostModal = ({ post, onClose, type, user  }) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const { addComment, deleteComment } = PostData();
    const [isOpen, setIsOpen] = useState(false);

    const handleAddComment = async () => {
      await addComment(post._id, comment, setComment);
    }
    const handleRemoveComment = async (comment) => {
      await deleteComment(post._id, comment._id);
    }
    
    const hasComment = comment.trim().length > 0;
    const isOwn = user._id === post.owner._id;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 items-center justify-center hover:-translate-y-0.5 transition cursor-pointer hidden md:flex">
          <CloseIcon />
        </button>
        <div className="relative w-full md:max-w-7xl h-[65vh] md:h-[88vh] bg-surface md:rounded-xl overflow-hidden flex flex-col md:flex-row z-10">
          {isOwn && (
            <>
            <button onClick={() => setIsOpen(prev => !prev)} className="absolute top-3 right-3 z-10 w-9 h-9 items-center justify-center hover:stroke-surface transition cursor-pointer hidden md:flex">
            <MoreIcon />
          </button>
          <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} postId={post._id} onClose={onClose} post={post} />
          </>
        )}
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
                {post?.post ? (
                  <img src={post.post.url} alt="" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center">
                    <span className="text-[0.65rem] tracking-[0.16em] uppercase text-subtle">no image</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {post?.type ? (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2.5">
                <Avatar id={post.owner?._id} avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
                <span className="text-[0.78rem] font-medium text-text tracking-wide">{post.owner?.name}</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
                {post.caption && (
                  <div className="flex gap-2.5">
                    <Avatar id={post.owner?._id} avatar={post.owner?.profilePic?.url} user={post.owner?.name} size="sm" />
                    <div>
                      <p className="text-[0.78rem] text-text leading-relaxed">
                        <span className="font-medium">{post.owner?.name}</span>{" "}
                        <span className="text-muted">{post.caption}</span>
                      </p>
                      <span className="text-[0.62rem] tracking-[0.08em] uppercase text-subtle mt-0.5 block">{post.timestamp}</span>
                    </div>
                  </div>
                )}

                {post?.comments?.map((c) => (
                  <div key={c._id} className="flex gap-2.5">
                    <Avatar id={c.user?._id} avatar={c.user?.profilePic?.url} user={c.user?.user} size="sm" />
                    <div className="flex-1 text-left">
                      <p className="text-[0.78rem] text-text leading-relaxed">
                        <Link to={`/profile/${c.user?._id}`}>
                          <span className="font-medium">{c.user?.name}</span>{" "}
                        </Link>
                        <span className="text-muted">{c.comment}</span>
                      </p>
                      <span className="text-[0.62rem] tracking-[0.08em] text-subtle mt-0.5 block">{formatDistanceToNow(parseISO(c.createdAt), { addSuffix: true })}</span>
                    </div>
                      {(c?.user?._id === user._id || post?.owner?._id === user._id) && (
                        <button onClick={() => handleRemoveComment(c)} className="text-red-500 hover:opacity-60 transition-opacity cursor-pointer">
                          <Trash2 size="20px" />
                        </button>
                      )}
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
      {}
    </div>
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