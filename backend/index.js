import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
    res.send("hello")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDb();
})