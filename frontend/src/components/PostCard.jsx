import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartIcon, CommentIcon, SaveIcon, MoreIcon } from "./icons";
import { AutoPlayVideo } from "./AutoPlayVideo";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import { PostModal } from "./PostModal";

export const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(post.saved ?? false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const { toggleLike } = PostData();
  const { user } = UserData();

  const isLiked = post.likes?.includes(user?._id);
  const isFollowing = post?.owner?.followers?.includes(user?._id);

  const handleLike = async (id) => await toggleLike(id);

  const handleMediaClick = () => {
    const isMobile = window.innerWidth < 768;
    if (post.type === "reel" && isMobile) {
      navigate("/reels");
    } else {
      setModalOpen(true);
    }
  };

  const isOwnPost = user === post.user;
  const formatDate = formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true });

  return (
    <>
      <article className="bg-bg border-b border-border">
        <PostHeader id={post.owner?._id} user={post.owner?.name} avatar={post.owner?.profilePic?.url} isOwn={isOwnPost} isCreatedAt={formatDate} isFollowing={isFollowing} />

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
        <PostModal post={post} onClose={() => setModalOpen(false)} type={post.type} user={user} />
      )}
    </>
  );
};

function PostHeader({ user, avatar, isOwn, isCreatedAt, id, isFollowing }) {
  const { toggleFollow } = UserData();
  const handleFollowToggle = () => {
    toggleFollow(id)
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <Avatar id={id} avatar={avatar} user={user} />
        <div className="flex flex-col">
          <Link to={`/profile/${id}`}>
            <span className="text-[0.78rem] font-medium text-text tracking-wide leading-tight">{user}</span>
          </Link>
        </div>
        <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
        <span className="text-[0.62rem] tracking-[0.08em] text-subtle mt-0.5 block">{isCreatedAt}</span>
      </div>
      <div className="flex items-center gap-2">
        {!isOwn && (
          <button 
          onClick={handleFollowToggle}
          className="text-[0.65rem] tracking-widest uppercase border px-2.5 py-1 rounded cursor-pointer
           border-border text-text hover:bg-surface transition-colors"
            >{isFollowing ? "unfollow" : "Follow"}
          </button>
        )}
        {isOwn && (
          <button className="p-1 cursor-pointer hover:stroke-surface transition">
            <MoreIcon />
          </button>
        )}
      </div>
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