export const HeartIcon = ({ filled, isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? "#FF3040" : "none"} stroke={filled ? "#FF3040" : (isMobile ? "white" : "#A3A3A3")} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

export const CommentIcon = ({ isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isMobile ? "white" : "#A3A3A3"} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export const SaveIcon = ({ filled, isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? (isMobile ? "white" : "#A3A3A3") : "none"} stroke={isMobile ? "white" : "#A3A3A3"} strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export const CloseIcon = () => {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export const MoreIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#F5F5F5">
      <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export const SearchIcon = () => {
  return (
    <svg 
      className="w-5 h-5 text-text/60" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
  </svg>
  )
}