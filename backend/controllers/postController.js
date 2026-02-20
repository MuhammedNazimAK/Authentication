import { Post } from "../models/postModel.js";
import cloudinary from 'cloudinary';
import getDataUrl from "../utils/urlGenerator.js";

export const createPost = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { caption } = req.body;

        const file = req.file;
        const fileUrl = getDataUrl(file);
        
        let option;
        
        const type = req.query.type;
        if (type === "reel") {
            option = {
                resource_type: "video",
            };
        } else {
            option = {};
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

        res.status(201).json({ message: "Post created", post });
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

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({type: "post"}).sort({ createdAt: -1 }).populate("owner", "-password");
        const reels = await Post.find({ type: "reel" }).sort({ createdAt: -1 }).populate("owner", "-password");

        res.json({posts, reels});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);

            await post.save();
            res.json({ message: "Post unliked" });
        } else {
            post.likes.push(req.user._id);
            await post.save();
            res.json({ message: "Post liked" });
        }
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
            name: req.user.name,
            comment: req.body.comment,
        });

        await post.save();
        res.json({ message: "Comment added" });
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