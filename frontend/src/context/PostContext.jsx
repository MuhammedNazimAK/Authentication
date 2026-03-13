import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { UserData } from "./UserContext";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);
    const { user } = UserData();

    async function fetchPosts() {
        try {
            const { data } = await axios.get('/api/post/all');
            setPosts(data.posts);
            setReels(data.reels);
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchPosts();
    }, []);

    async function addPost(formData, setFile, setCaption, setFileType, setPreview) {
        try {
            const { data } = await axios.post('/api/post/create', formData);
            if (data.newPost) {
                setPosts(prev => [data.newPost, ...prev]);
                if (data.newPost.type === "reel") {
                    setReels(prev => [data.newPost, ...prev]); 
                }
                toast.success(data.message);

                fetchPosts();
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
            
        } catch (err) {
            console.error(err);
        }
    }

    return <PostContext.Provider value={{ posts, reels, addPost, toggleLike }}>{children}</PostContext.Provider>
}

export const postData = () => useContext(PostContext);