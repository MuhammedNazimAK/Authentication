import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './database/db.js';

dotenv.config();
const app = express();
const port = process.env.PORT;


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