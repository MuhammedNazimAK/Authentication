import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { getChats, getMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.post("/", isAuth, sendMessage);
router.get("/chat", isAuth, getChats);
router.get("/:id", isAuth, getMessages);

export default router;