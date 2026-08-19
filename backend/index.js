import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/message", messageRoutes);

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
});