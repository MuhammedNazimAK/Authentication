import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { createPost, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.post("/create", isAuth, uploadFile, createPost);
router.delete("/:id", isAuth, deletePost);

export default router;