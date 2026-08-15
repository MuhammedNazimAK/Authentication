import { useState } from "react";
import { PostData } from "../context/PostContext";
import { CreatePostModal } from "./CreatePostModal";

export const Dropdown = ({ isOpen, setIsOpen, postId, onClose, post }) => {
    const { deletePost } = PostData();
    const [editingPost, setEditingPost] = useState(null);
    
    return (
        <>
        {isOpen && (
            <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 top-14 w-48 bg-surface border border-border rounded-md shadow-lg py-1 z-20">
                <button 
                    onClick={() => { 
                        setEditingPost(post)
                        setIsOpen(false); 
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-text hover:bg-border rounded-md cursor-pointer"
                >
                Edit
                </button>
            <button 
                onClick={() => {  
                    deletePost(postId, onClose)
                    setIsOpen(false); 
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-border rounded-md cursor-pointer"
                >
                Delete
            </button>
        </div>
      </>
    )}
    {editingPost && (
        <CreatePostModal initialData={editingPost} onClose={() => setEditingPost(null)} />
    )}
  </>
);
}