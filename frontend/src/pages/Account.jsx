import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { PostModal } from "../components/PostModal";
import { FollowersModal } from "../components/FollowersModal";
 
export const Account = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [type, setType] = useState(null);
  const { userPosts, userReels, fetchUserPosts } = PostData();
  const { LogoutUser } = UserData();

  const selectedPost = userPosts.find(p => p._id === selectedPostId) ||
                       userReels.find(p => p._id === selectedPostId);

  const handleMediaClick = (item) => {
    const isMobile = window.innerWidth < 768;
    if (item.type === "reel" && isMobile) {
      navigate("/reels");
    } else {
      setSelectedPostId(item._id);
    }
  };

  const handleTypeClick = (type) => {
    setType(type);
  }

  const handlePostDelete = () => {
    deletePost()
  }

  const logoutHandler = () => {
    LogoutUser(navigate);
  };

  useEffect(() => {
    if (user?._id) fetchUserPosts(user._id);
  }, [user?._id]);

  if (!user) return null;

  return (
    <>
    <div className="min-h-screen bg-bg pt-14 md:pt-0">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        
        <div className="flex items-center gap-6 sm:gap-10 mb-6">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-border bg-surface overflow-hidden shrink-0 flex items-center justify-center">
            {user.profilePic ? (
              <img src={user.profilePic.url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#99968F" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between md:justify-start md:gap-8">
              <h2 className="text-lg font-medium text-text tracking-wide">{user.name}</h2>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-text cursor-pointer" onClick={() => handleTypeClick("followers")}>{user.followers.length}</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-muted cursor-pointer" onClick={() => handleTypeClick("followers")}>followers</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-text cursor-pointer" onClick={() => handleTypeClick("followings")}>{user.followings.length}</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-muted cursor-pointer" onClick={() => handleTypeClick("followings")}>following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <span className="text-sm text-text font-medium">{user.name}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-sm text-muted">{user.email}</span>
            <span className="text-sm text-subtle capitalize">• {user.gender}</span>
          </div>
        </div>

        <div className="mb-2">
          <Link
            to="/settings"
            className="block w-full text-center text-[0.7rem] tracking-widest uppercase text-text font-medium border border-border bg-bg rounded-md py-2 hover:bg-surface transition-colors"
          >
            edit profile
          </Link>
        </div>

        <div className="flex justify-around border-b border-border">
          {["posts", "reels", "saved"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pt-2 pb-2 flex-1 text-[0.7rem] tracking-widest uppercase cursor-pointer
                ${activeTab === tab
                  ? "text-text border-b-2 border-border -mt-px"
                  : "text-subtle"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-1">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <div
                    key={post._id} className="aspect-square bg-bg border border-border cursor-pointer">
                      <img onClick={() => handleMediaClick(post)} src={post.post.url} alt={post.caption} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-widest uppercase text-subtle">
                  no posts yet
                </div>
              )}
            </div>
          )}

          {activeTab === "reels" && (
            <div className="grid grid-cols-3 gap-1">
              {userReels.length > 0 ? (
                userReels.map((reel) => (
                  <div key={reel._id} className="aspect-square bg-bg border border-border overflow-hidden relative cursor-pointer">
                    <video onClick={() => handleMediaClick(reel)} src={reel.post.url} muted className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-widest uppercase text-subtle">
                  no reels yet
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-widest uppercase text-subtle">
              no saved posts
            </div>
          )}
        </div>
      </div>
      {selectedPost && (
        <PostModal post={selectedPost} type={selectedPost?.type} onClose={() => setSelectedPostId(null)} user={user} />
      )}
      {type && (
        <FollowersModal isOpen={Boolean(type)} onClose={() => setType(null)} userId={user._id} type={type}/>
      )}
    </>
  );
}