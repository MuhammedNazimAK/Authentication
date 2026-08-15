import { createContext, useContext, useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        axios.get('/api/user/me')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    async function RegisterUser (formData, navigate) {
        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/auth/register', formData);
            toast.success(data.message);
            setUser(data.user);
            navigate('/');
            setIsSubmitting(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setIsSubmitting(false);
        }
    }

    async function LoginUser (email, password, navigate) {
        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password, navigate });
            toast.success(data.message);
            setUser(data.user);
            navigate('/');
            setIsSubmitting(false);
        } catch (error) {
            toast.error(error.response.data.message);
            setIsSubmitting(false);
        }
    }

    async function LogoutUser (navigate) {
        try {
            const { data } = await axios.get('/api/auth/logout');
            if (data.message) {
                toast.success(data.message);
                setUser(null);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function searchUsers (query) {
        if (!query || !query.trim('')) {
            setSearchResults([]);
            return;
        }
        
        try {
            const { data } = await axios.get(`/api/user/search?query=${query}`);
            setSearchResults(data.users);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    }

    async function toggleFollow (id, setViewedUser) {
        try {
            const { data } = await axios.post(`/api/user/follow/${id}`);
            toast.success(data.message);

            setUser(data.currentUser);

            if (setViewedUser) {
                setViewedUser(data.updatedUser);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    }

    async function updateProfile(id, formData) {
        try {
            const { data } = await axios.put(`/api/user/profile/${id}`, formData);
            toast.success(data.message);
            if (data.user) setUser(data.user);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function updatePassword(id, passwords) {
        try {
            const { data } = await axios.post(`/api/user/password/${id}`, passwords);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return <UserContext.Provider value={{ RegisterUser, LoginUser, user, loading, isSubmitting, LogoutUser, searchResults, searchUsers, toggleFollow, updateProfile, updatePassword }}>{children}<Toaster position="top-right"/></UserContext.Provider>
}

export const UserData = () => useContext(UserContext);