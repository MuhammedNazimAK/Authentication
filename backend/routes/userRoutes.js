import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { followAndUnfollow, followersAndFollowingsData, myProfile, userProfile } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:id', isAuth, userProfile);
router.post("/follow/:id", isAuth, followAndUnfollow);
router.get("/followdata/:id", isAuth, followersAndFollowingsData);

export default router;

