import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

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
    }, [])

    return <PostContext.Provider value={{ posts, reels }}>{children}</PostContext.Provider>
}

export const postData = () => useContext(PostContext);