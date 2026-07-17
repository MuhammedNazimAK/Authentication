import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import uploadFile from '../middleware/multer.js';
import { commentOnPost, createPost, deleteComment, deletePost, editCaption, getUserPosts, homeFeed, likeUnlikePost, reelsFeed } from '../controllers/postController.js';

const router = express.Router();

router.post("/create", isAuth, uploadFile, createPost);
router.get("/feed", isAuth, homeFeed);
router.get("/reel", isAuth, reelsFeed);
router.get("/user/:userId", isAuth, getUserPosts);
router.put("/:id", isAuth, editCaption);
router.delete("/:id", isAuth, deletePost);
router.post("/:id/like", isAuth, likeUnlikePost);
router.post("/comment/:id", isAuth, commentOnPost);
router.delete("/comment/:id", isAuth, deleteComment);

export default router;