import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["Male", "Female"],
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        profilePic: {
            id: String,
            url: String,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);