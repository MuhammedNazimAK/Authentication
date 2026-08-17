import { useEffect, useState } from "react";
import { ChatData } from "../context/ChatContext"
import axios from "axios";
import { SearchIcon } from "../components/icons";
import { UserData } from '../context/UserContext';
import { formatDistanceToNow, parseISO } from "date-fns";

export const Chat = () => {
    const { createChat, chats, setChats, selectedChat, setSelectedChat } = ChatData();
    const { user } = UserData();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            async function fetchAllUsers() {
                try {
                    const { data } = await axios.get(`/api/user/all?search=${searchQuery}`);
                    setUsers(data.users);
                } catch (error) {
                    console.log(error)
                }
            }
            fetchAllUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (!selectedChat) return;
        const fetchMessages = async () => {
            try {
                const otherUserId = selectedChat.users[0]._id;
                const { data } = await axios.get(`/api/message/${otherUserId}`);
                setMessages(data);
            } catch (error) {
                setMessages([]);
            }
        }
        fetchMessages();
    }, [selectedChat]);

    const getAllChats = async () => {
        try {
            const { data } = await axios.get(`/api/message/chat`);
            setChats(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    const handleUserClick = (clickedUser) => {
        const existingChat = chats.find((chat) => 
            chat.users.some((u) => u._id === clickedUser._id)
        );
        if (existingChat) {
            setSelectedChat(existingChat);
        } else {
            setSelectedChat({
                _id: null,
                users: [clickedUser],
            });
        }
    }
    const handleSend = async () => {
        if (!text.trim() || !selectedChat) return;
        const otherUserId = selectedChat.users[0]._id;
        const newMessage = await createChat(otherUserId, text);
        if (newMessage) {
            setMessages((prev) => [...prev, newMessage]);
            setText("");
            setUsers((prev) => 
                prev.map((u) => 
                    u._id === otherUserId
                    ? {...u, latestMessage: { text, sender: user._id }}
                    : u
                )
            );
            if (!selectedChat._id) {
                const updatedChats = await getAllChats();
                const realChat = updatedChats?.find((chat) => 
                    chat.users.some((u) => u._id === otherUserId)
                );
                if (realChat) setSelectedChat(realChat);
            }
        }
    };
    useEffect(() => {
        getAllChats()
    }, []);
    return (
        <div className="min-h-screen pt-14 md:pt-0">
            <div className="flex h-screen overflow-hidden">
                <div className="w-1/3 p-4 border-r border-border h-full overflow-y-auto">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 items-center left-0 flex pl-4 pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text"
                            className="w-full border rounded-xl border-border bg-surface p-2 pl-12"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full mt-4">
                        <ul>
                            {users?.map((item) =>
                            <li className="flex items-center gap-3 text-text p-3 hover:bg-border/20 cursor-pointer"
                                key={item._id}
                                onClick={() => handleUserClick(item)}
                            >
                            <img src={item.profilePic.url} alt={item.name} 
                                className="w-10 h-10 rounded-full object-cover"    
                            />   
                            <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                {item.latestMessage?.text && (
                                    <span className="text-sm text-muted">
                                        {item.latestMessage.sender === user._id ? "You: " : ""}
                                        {item.latestMessage.text}
                                    </span>
                                )}
                            </div>
                            </li> 
                            )}
                        </ul>
                    </div>
                </div>
                <div className="w-2/3 h-full flex flex-col">
                    {selectedChat ? (
                        <>
                            <div className="flex items-center gap-3 p-4 border-b border-border">
                                <img src={selectedChat.users[0].profilePic?.url} 
                                     alt={selectedChat.users[0].name} 
                                     className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="font-medium">{selectedChat.users[0].name}</span>
                            </div>
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                            {messages.map((msg) => (
                                <div key={msg._id} className={`flex items-center gap-2 ${
                                    msg.sender === user._id ? "self-end flex-row-reverse" : "self-start"
                                }`}
                                >
                                
                                <div
                                    className={`max-w-[70%] p-2 px-3 rounded-xl ${
                                        msg.sender === user._id
                                        ? "bg-accent text-text" 
                                        : "bg-surface"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <span className={`text-[0.64rem] tracking-[0.08em] text-muted whitespace-nowrap`}>
                                    {formatDistanceToNow(parseISO(msg.createdAt), { addSuffix: true })}
                                </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-border flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 border rounded-xl border-border bg-surface p-2" 
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            />
                            <button
                                onClick={handleSend}
                                className="px-4 py-2 rounded-xl bg-accent text-text cursor-pointer"
                            >
                                Send
                            </button>
                        </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted">
                            Select a user to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}