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

