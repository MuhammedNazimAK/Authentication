import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserData } from "./UserContext";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const [userReels, setUserReels] = useState([]);
    
    const { user } = UserData();

    async function fetchHomeFeed() {
        try {
            const { data } = await axios.get("/api/post/feed");
            setPosts(data.posts);
        } catch (error) {
            console.error("Eror fetching home feed:", error);
        }
    }

    async function fetchReelFeed() {
        try {
            const { data } = await axios.get("/api/post/reel");
            setReels(data.reels);
        } catch (error) {
            console.error("Error fetching reel feed:", error);
        }
    }

    async function fetchUserPosts(targetUserId) {
        try {
            const { data } = await axios.get(`/api/post/user/${targetUserId}`);
            setUserPosts(data.posts);
            setUserReels(data.reels);
        } catch (error) {
            console.error("Error fetching profile posts:", error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchHomeFeed();
            fetchReelFeed();
        }
    }, [user]);

    async function addPost(formData, setFile, setCaption, setFileType, setPreview) {
        try {
            const { data } = await axios.post('/api/post/create', formData);
            if (data.newPost) {
                setPosts(prev => [data.newPost, ...prev]);
                if (data.newPost.type === "reel") {
                    setReels(prev => [data.newPost, ...prev]); 
                }
                toast.success(data.message);

                fetchHomeFeed();
                setFile(null);
                setCaption("");
                setFileType(null);
                setPreview(null);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function toggleLike(id) {
        try {
            const { data: updatedPost } = await axios.post(`/api/post/${id}/like`);

            const updateList = (list) => list.map(item => item._id === id ? updatedPost : item);

            setPosts(prev => updateList(prev));
            setReels(prev => updateList(prev));
            setUserPosts(prev => updateList(prev));
            setUserReels(prev => updateList(prev));
        } catch (err) {
            console.error(err);
        }
    }

    

    return <PostContext.Provider value={{ posts, reels, userPosts, userReels, fetchHomeFeed, fetchUserPosts, fetchUserPosts, addPost, toggleLike }}>{children}</PostContext.Provider>
}

export const PostData = () => useContext(PostContext);