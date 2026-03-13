import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

export const Account = ({ user }) => {

  const [activeTab, setActiveTab] = useState("posts");

  const navigate = useNavigate();

  const { LogoutUser } = UserData();
  
  const logoutHandler = () => {
    LogoutUser(navigate);
  };

  return (
  <div className="min-h-screen bg-[#FAF7F2]">
    <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#DDD8CF] bg-[#FDFBF8] sticky top-0 z-10">
      <span className="text-[0.7rem] tracking-[0.16em] uppercase text-[#99968F]">Account</span>
    </div>

    <div className="max-w-2xl mx-auto px-4 py-6 md:py-10">
      
      <div className="flex items-center gap-6 sm:gap-10 mb-6">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-[#DDD8CF] bg-[#F0EBE1] overflow-hidden shrink-0 flex items-center justify-center">
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
            <h2 className="text-lg font-medium text-[#111] tracking-wide">{user.name}</h2>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-[#111]">{user.followers.length}</span>
              <span className="text-[0.65rem] tracking-widest uppercase text-[#99968F]">followers</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-[#111]">{user.followings.length}</span>
              <span className="text-[0.65rem] tracking-widest uppercase text-[#99968F]">following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <span className="text-sm text-[#111] font-medium">{user.name}</span>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-sm text-[#555550]">{user.email}</span>
          <span className="text-sm text-[#99968F] capitalize">• {user.gender}</span>
        </div>
      </div>

      <div className="mb-2">
        <Link
          to="/settings"
          className="block w-full text-center text-[0.7rem] tracking-[0.14em] uppercase text-[#111] font-medium border border-[#DDD8CF] bg-[#FDFBF8] rounded-md py-2 hover:bg-[#F0EBE1] transition-colors"
        >
          edit profile
        </Link>
      </div>

      <div className="flex justify-around border-b border-[#DDD8CF]">
        {["posts", "saved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pt-2 pb-2 flex-1 text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-150 cursor-pointer
              ${activeTab === tab
                ? "text-[#111] border-b-2 border-[#111] -mt-px"
                : "text-[#99968F]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

        {/* ── Posts Grid ── */}
        {/* {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-1">
            {mockPosts.length > 0 ? (
              mockPosts.map((post, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#F0EBE1] border border-[#DDD8CF]"
                > */}
                  {/* Replace with <img src={post.image} /> */}
                {/* </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-[0.14em] uppercase text-[#99968F]">
                no posts yet
              </div>
            )} */}
          {/* </div>
        )} */}

        {/* {activeTab === "saved" && (
          <div className="col-span-3 py-16 text-center text-[0.75rem] tracking-[0.14em] uppercase text-[#99968F]">
            no saved posts
          </div>
        )} */}

      </div>
    </div>
  );
}