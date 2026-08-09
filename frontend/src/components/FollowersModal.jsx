import axios from "axios"
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { CloseIcon } from "./icons";
import { Link } from "react-router-dom";

export const FollowersModal = ({ isOpen, onClose, userId, type }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchConnectionsData = async () => {
            try {
                const { data } = await axios.get(`/api/user/followdata/${userId}`, {
                    params: { type }, 
                });
                setData(data.users || []);
            } catch (error) {
                toast.error(error.response?.data?.message || `Failed to load ${type}`);
            }
        }
        if (isOpen && userId && type) fetchConnectionsData();
    }, [isOpen, userId, type]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 background-blur-xs p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-bg border border-border rounded-lg overflow-hidden flex flex-col max-h-[70vh]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-text tracking-wide capitalize">
                        {type}
                    </span>
                    <button 
                        onClick={onClose}
                        className="text-muted hover:text-text cursor-pointer"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-border/40">
                {data.length > 0 ? (
                    data.map((item) => (
                    <Link
                        key={item._id}
                        to={`/profile/${item._id}`}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full border border-border bg-surface overflow-hidden shrink-0 flex items-center justify-center">
                        {item.profilePic ? (
                            <img
                            src={item.profilePic.url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            />
                        ) : (
                            <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#99968F"
                            strokeWidth="1.5"
                            >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                            </svg>
                        )}
                        </div>
                        <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-text truncate">
                            {item.name}
                        </span>
                        <span className="text-xs text-muted truncate">
                            {item.email}
                        </span>
                    </div>
                </Link>
                ))
            ) : (
                <div className="py-10 text-center text-[0.75rem] tracking-widest uppercase text-subtle">
                No {type} found
                </div>
            )}
        </div>
      </div>
    </div>
    )
}