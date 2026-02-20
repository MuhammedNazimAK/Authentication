import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { commentOnPost, createPost, deleteComment, deletePost, editCaption, getAllPosts, likeUnlikePost } from '../controllers/postController.js';

const router = express.Router();

router.post("/create", isAuth, uploadFile, createPost);
router.put("/:id", isAuth, editCaption);
router.delete("/:id", isAuth, deletePost);
router.get("/all", isAuth, getAllPosts);
router.post("/like/:id", isAuth, likeUnlikePost);
router.post("/comment/:id", isAuth, commentOnPost);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;