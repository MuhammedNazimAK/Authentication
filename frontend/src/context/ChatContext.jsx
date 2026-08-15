import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    

    return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>
}

export const ChatData = () => useContext(ChatContext);