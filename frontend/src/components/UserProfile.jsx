import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import toast from "react-hot-toast";

export const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user: currentUser, toggleFollow } = UserData();
  const { userPosts, userReels, fetchUserPosts } = PostData();

  const [viewedUser, setViewedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axios.get(`/api/user/${id}`);
        setViewedUser(data);
        fetchUserPosts(id);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    };

    if (id) fetchProfileData();
  }, [id]);

  const isOwnProfile = currentUser?._id === viewedUser?._id;
  const isFollowing = viewedUser?.followers?.includes(currentUser?._id);

  const handleFollowToggle = () => {
    toggleFollow(id, setViewedUser); 
  };

  const handleMessageClick = () => {
    navigate(`/messages/${id}`);
  };

  return (
    <div className="min-h-screen bg-bg pt-14 md:pt-0">
      <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
        
        <div className="flex items-center gap-6 sm:gap-10 mb-6">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-border bg-surface overflow-hidden shrink-0 flex items-center justify-center">
            {viewedUser?.profilePic ? (
              <img src={viewedUser.profilePic.url} alt={viewedUser?.name} className="w-full h-full object-cover" />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#99968F" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>

          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between md:justify-start md:gap-8">
              <h2 className="text-lg font-medium text-text tracking-wide">{viewedUser?.name}</h2>
            </div>

            <div className="flex gap-8">
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-text">{viewedUser?.followers?.length || 0}</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-muted">followers</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-text">{viewedUser?.followings?.length || 0}</span>
                <span className="text-[0.65rem] tracking-widest uppercase text-muted">following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <span className="text-sm text-text font-medium">{viewedUser?.name}</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-sm text-muted">{viewedUser?.email}</span>
            <span className="text-sm text-subtle capitalize">• {viewedUser?.gender}</span>
          </div>
        </div>

        <div className="mb-4">
          {isOwnProfile ? (
            <button
              onClick={() => navigate("/settings")}
              className="block w-full text-center text-[0.7rem] tracking-widest uppercase text-text font-medium border border-border bg-bg rounded-md py-2 hover:bg-surface transition-colors cursor-pointer"
            >
              edit profile
            </button>
          ) : (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleFollowToggle}
                className={`flex-1 text-center text-[0.7rem] tracking-widest uppercase font-medium border rounded-md py-2 transition-colors cursor-pointer
                  ${isFollowing 
                    ? "border-border bg-surface text-text hover:bg-bg" 
                    : "border-transparent bg-text text-bg hover:opacity-90"
                  }`}
              >
                {isFollowing ? "unfollow" : "follow"}
              </button>
              <button
                onClick={handleMessageClick}
                className="flex-1 text-center text-[0.7rem] tracking-widest uppercase text-text font-medium border border-border bg-bg rounded-md py-2 hover:bg-surface transition-colors cursor-pointer"
              >
                message
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-around border-b border-border">
          {["posts", "reels"].map((tab) => (
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
                <div key={post._id} className="aspect-square bg-bg border border-border cursor-pointer">
                  <img src={post.post.url} alt={post.caption} className="w-full h-full object-cover" />
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
                  <video src={reel.post.url} muted className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-widest uppercase text-subtle">
                no reels yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};