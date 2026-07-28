import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

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

    comments: [commentSchema],

    createdAt: {
        type: Date,
        default: Date.now,
    }
})

export const Post = mongoose.model("Post", postSchema);