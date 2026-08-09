import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import cloudinary from 'cloudinary';
import getDataUrl from "../utils/urlGenerator.js";

export const createPost = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { caption, type } = req.body;

        const file = req.file;
        if (!file) return res.status(400).json({ message: "Video or Image file is required" });
        const fileUrl = getDataUrl(file);
        
        let option = {};
        
        if (type === "reel") {
            option = {
                resource_type: "video",
            };
        }

        const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
            folder: "Core social",
            ...option
        });

        const post = await Post.create({
            owner: ownerId,
            caption,
            post: {
                id: cloud.public_id,
                url: cloud.secure_url
            },
            type,
        })

        const populatedPost = await Post.findById(post._id).populate("owner", "-password");

        res.status(201).json({ message: "Post created", newPost: populatedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ messsage: "No post with this id" });
        }
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const resourceType = post.type === "reel" ? "video" : "image";
        await cloudinary.v2.uploader.destroy(post.post.id, {
            resource_type: resourceType
        });
        await post.deleteOne();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const owner = req.params.userId;
        const posts = await Post.find({ owner, type: "post" }).sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate("comments.user", "name profilePic");
        const reels = await Post.find({ owner, type: "reel" }).sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate("comments.user", "name profilePic");

        res.json({ posts, reels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const homeFeed = async (req, res) => {
    try {

        const currentUserId = req.user._id;

        const posts = await Post.find({ owner: { $ne: currentUserId } })
            .sort({ createdAt: -1 })
            .populate("owner", "-password")
            .populate("comments.user", "name profilePic");

        res.json({ posts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const reelsFeed = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const reels = await Post.find({ 
            owner: { $ne: currentUserId }, 
            type: "reel" 
        })
        .sort({ createdAt: -1 })
        .populate("owner", "-password")
        .populate("comments.user", "name profilePic");

        res.json({ reels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });
        const isLiked = post.likes.some(id => id.toString() === req.user._id.toString());

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        const updatedPost = await post.populate("owner", "name profilePic");
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const commentOnPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.comments.push({
            user: req.user._id,
            comment: req.body.comment,
        });

        await post.save();
        const updatedPost = await Post.findById(post._id).populate("owner", "-password").populate("comments.user", "name profilePic");
        
        res.status(200).json({
            message: "Comment added",
            updatedPost
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!req.body.commentId) return res.status(404).json({ message: "Provide a comment id" });
        
        const commentIndex = post.comments.findIndex(
            (item) => item._id.toString() === req.body.commentId.toString()
        );
        if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

        const comment = post.comments[commentIndex];
        if (post.owner.toString() === req.user._id.toString() || comment.user.toString() === req.user._id.toString()) {
            post.comments.splice(commentIndex, 1);
            await post.save();
            res.json({ message: "Comment deleted" });
        } else {
            return res.status(400).json({ message: "You are not allowed to delete this comment" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        post.caption = req.body.caption;
        await post.save();
        res.json({ message: "Caption changed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}