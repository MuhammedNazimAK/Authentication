import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
     
    caption: String,

    post: {
        id: String,
        url: String,
    },

    type: {
        type: String,
        required: true
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }        
    ],

    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true
            },
        },
    ],

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export const Post = mongoose.model("Post", postSchema);