import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {

    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);

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
        console.log("Toggling like for post ID:", id);
        try {
            await axios.post(`/api/post/${id}/like`);

            setReels(prev =>
                prev.map(reel => {
                    if (reel._id !== id) return reel;

                    const isLiked = reel.liked;

                    return {
                    ...reel,
                    liked: !isLiked,
                    likes: isLiked
                        ? reel.likes.filter(l => l !== user._id)
                        : [...reel.likes, user._id]
                    };
                })
            );

            setPosts(prev =>
                prev.map(post => {
                    if (post._id !== id) return post;

                    const isLiked = post.liked;

                    return {
                    ...post,
                    liked: !isLiked,
                    likes: isLiked
                        ? post.likes.filter(l => l !== user._id)
                        : [...post.likes, user._id]
                    };
                })
            );
            
        } catch (err) {
            console.error(err);
        }
    }

    return <PostContext.Provider value={{ posts, reels, addPost, toggleLike }}>{children}</PostContext.Provider>
}

export const postData = () => useContext(PostContext);