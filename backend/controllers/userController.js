import { User } from "../models/userModel.js"
import cloudinary from 'cloudinary';
import getDataUrl from '../utils/urlGenerator.js';
import bcrypt from 'bcrypt';

export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const userProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "user with that id not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const followAndUnfollow = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).json({ message: "User not found" });
        const loggedInUser = await User.findById(req.user._id);
        if (user._id.toString() === loggedInUser._id.toString()) return res.status(400).json({ message: "you cant follow yourself" });

        if (user.followers.includes(loggedInUser._id)) {
            const indexOfFollowing = loggedInUser.following.indexOf(user._id);
            const indexOfFollower = user.followers.indexOf(loggedInUser._id);

            loggedInUser.following.splice(indexOfFollowing, 1);
            user.followers.splice(indexOfFollower, 1);

            await loggedInUser.save();
            await user.save();
            res.json({ message: "User unfollowed" });

        } else {
            loggedInUser.following.push(user._id);
            user.followers.push(loggedInUser._id);

            await loggedInUser.save();
            await user.save();
            res.json({ message: "User followed" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const followersAndFollowingsData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password").populate("followers", "-password").populate("following", "-password");

        const followers = user.followers;
        const followings = user.following;
        res.json({ followers, followings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name } = req.body;
        if (name) {
            user.name = name
        }

        const file = req.file;
        if (file) {
            const fileUrl = getDataUrl(file);

            await cloudinary.v2.uploader.destroy(user.profilePic.id);
            const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
                folder: "Core social"
            });

            user.profilePic.id = cloud.public_id;
            user.profilePic.url = cloud.secure_url;
        }

        await user.save();

        res.json({ message: "profile updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;

        const comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (!comparePassword) return res.status(400).json({ message: "Wrong old password" });

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();
        res.json({ message: "Password changed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

