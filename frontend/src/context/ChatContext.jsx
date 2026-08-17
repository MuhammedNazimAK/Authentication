import { createContext, useContext, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    async function createChat(id, message) {
        try {
            const { data } = await axios.post("/api/message", {
                recieverId: id,
                message: message
            })
            return data;
        } catch (error) {
            console.error(error.response.data.message)
        }
    }

    return <ChatContext.Provider value={{ createChat, chats, setChats, selectedChat, setSelectedChat }}>{children}</ChatContext.Provider>
}

export const ChatData = () => useContext(ChatContext);