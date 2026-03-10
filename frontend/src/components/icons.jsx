export const HeartIcon = ({ filled, isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? (isMobile ? "#FF3040" : "#111") : "none"} stroke={isMobile ? "white" : "#111"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export const CommentIcon = ({ isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isMobile ? "white" : "#99968F"} strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export const SaveIcon = ({ filled, isMobile }) => {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? (isMobile ? "white" : "#111") : "none"} stroke={isMobile ? "white" : "#111"} strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}