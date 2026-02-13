import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';

export const registerUser = async (req, res) => {
    try {
        
        const { name, email, password, gender } = req.body;
        const file = req.file;
        if (!name || !email || !password || !gender || !file) {
            return res.status(400).json({
                message: "please provide all values"
            })
        }

        let user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message: "User already exist"
            })
        }

        const fileUrl = getDataUrl(file);
        const hashPassword = await bcrypt.hash(password, 10);
        const cloud = await cloudinary.v2.uploader.upload(fileUrl.content, {
            folder: "Core social"
        });
        user = await User.create({
            name,
            email,
            password: hashPassword,
            gender,
            profilePic: {
                id: cloud.public_id,
                url: cloud.secure_url
            },
        });

        generateToken(user._id, res);
        res.status(201).json({
            message: "User registered",
            user,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const {email, password} = req.body;
        if (!email, !password) {
            return res.status(400).json({
                message: "Please provide all values"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);
        res.json({ message: "Login successfull", user });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

export const logoutUser = (req, res) => {
    res.cookie("token", "", { maxAge: 0 });

    res.json({ message: "Logout successfull" });
}