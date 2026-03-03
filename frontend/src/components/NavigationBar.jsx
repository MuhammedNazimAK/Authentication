import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { useState } from "react";
import { CreatePostModal } from "./CreatePostModal";

const hideTopBarRoutes = ["/search", "/chat"];
const navItems = [
  {
    label: "home",
    to: "/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    label: "reels",
    to: "/reels",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <path d="M10 8l6 4-6 4V8z" />
      </svg>
    ),
  },
  {
    label: "search",
    to: "/search",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "chat",
    to: "/chat",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "create",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    isButton: true,
  },
  {
    label: "profile",
    to: "/account",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export const NavigationBar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { LogoutUser } = UserData();
  const [showMore, setShowMore] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isReels = pathname === "/reels";
  const hideTopBar = hideTopBarRoutes.includes(pathname);

  const logoutHandler = () => LogoutUser(navigate);
  
  return (
    <>
    {!hideTopBar && (
        <div
          className={`md:hidden fixed top-0 left-0 right-0 h-14 px-4 flex items-center z-20 transition-colors duration-300 ${
            isReels
              ? "bg-transparent border-none justify-center"
              : "bg-[#FDFBF8] border-b border-[#DDD8CF] justify-between"
          }`}
        >
          <button
            onClick={() => setIsCreateOpen(true)}
            className={`p-1 transition-colors cursor-pointer ${
              isReels ? "text-white drop-shadow-md" : "text-[#111]"
            }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>

          {!isReels && (
            <>
              <h1 className="app-logo text-xl">Core</h1>

              <div className="relative">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="p-1 text-[#111] cursor-pointer"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>

                {showMore && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-[#FDFBF8] border border-[#DDD8CF] rounded-lg shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
                    <Link
                      to="/settings"
                      onClick={() => setShowMore(false)}
                      className="flex items-center px-4 py-3 text-sm text-[#111] hover:bg-[#F0EBE1] transition-colors"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => { setShowMore(false); logoutHandler(); }}
                      className="w-full text-left px-4 py-3 text-sm text-[#111] border-t border-[#DDD8CF] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 bg-[#FDFBF8] border-r border-[#DDD8CF] px-4 py-8 z-20">

        <Link
          to="/"
          className="app-logo text-[2rem] tracking-[0.12em] text-[#111] mb-10 px-2"
        >
          Core
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, to, icon, isButton }) => {
            const active = pathname === to;
            const commonClass = `flex items-center gap-4 px-3 py-3 rounded-md text-sm tracking-wide transition-colors duration-150 cursor-pointer ${
            active ? "text-[#111] font-medium bg-[#F0EBE1]" : "text-[#99968F] hover:bg-[#F0EBE1]/50"
            }`;

            if (isButton) {
            return (
                <button key={label} onClick={() => setIsCreateOpen(true)} className={commonClass}>
                <span>{icon}</span>
                {label}
                </button>
            );
            }

            return (
            <Link key={to} to={to} className={commonClass}>
                <span>{icon}</span>
                {label}
            </Link>
            );
        })}
        </nav>

        <div className="mt-auto relative">
          {showMore && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#FDFBF8] border border-[#DDD8CF] rounded-lg shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-bottom-2">
              <Link
                to="/settings"
                onClick={() => setShowMore(false)}
                className="flex items-center px-4 py-3 text-sm text-[#111] hover:bg-[#F0EBE1] transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={logoutHandler}
                className="w-full text-left px-4 py-3 text-sm text-[#111] border-t border-[#DDD8CF] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}

          <button
            onClick={() => setShowMore(!showMore)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-md text-sm tracking-wide transition-colors
              ${showMore ? "bg-[#F0EBE1] text-[#111]" : "text-[#99968F] hover:bg-[#F0EBE1]/50"}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            More
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-[#FDFBF8] border-t border-[#DDD8CF] flex items-center justify-around px-2 py-3">
        {navItems
        .filter((item) => !item.isButton)
        .map(({ label, to, icon }) => {
            const active = pathname === to;
            return (
                <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 transition-colors duration-150
                    ${active ? "text-[#111]" : "text-[#99968F]"}`}
                >
                {icon}
                <span className="text-[0.6rem] tracking-[0.12em] uppercase">{label}</span>
                </Link>
            );
            })}
      </nav>
      {isCreateOpen && <CreatePostModal onClose={() => setIsCreateOpen(false)} />}
    </>
  );
}