import { Chat } from "../models/chatModel.js";
import { Messages } from "../models/messages.js";

export const sendMessage = async (req, res) => {
    try {
        const { recieverId, message } = req.body;
        if (!recieverId) return res.status(400).json({ message: "provide reciever id" });
        const senderId = req.user._id;

        let chat = await Chat.findOne({
            users: { $all: [senderId, recieverId] },
        })

        if (!chat) {
            chat = new Chat({
                users: [senderId, recieverId],
                latestMessage: {
                    text: message,
                    sender: senderId
                },
            });
            await chat.save();
        }

        const newMessage = new Messages({
            chatId: chat._id,
            sender: senderId,
            text: message,
        });

        await newMessage.save();

        await chat.updateOne({
            latestMessage: {
                text: message,
                sender: senderId,
            },
        });

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const chat = await Chat.findOne({
            users: { $all: [userId, id]},
        })
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const messages = await Messages.find({ 
            chatId: chat._id
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const getChats = async (req, res) => {
    try {
        const chat = await Chat.find({
            users: req.user._id,  
        }).populate({ path: "users", select: "name profilePic" });

        chat.forEach((e) => {
            e.users = e.users.filter(
                (user) => user._id.toString() !== req.user._id.toString()
            );
        });
        
        res.json(chat);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}