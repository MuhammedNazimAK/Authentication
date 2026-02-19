import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { followAndUnfollow, followersAndFollowingsData, myProfile, updatePassword, updateProfile, userProfile } from '../controllers/userController.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get('/:id', isAuth, userProfile);
router.post('/:id', isAuth, updatePassword);
router.put('/:id', isAuth, uploadFile, updateProfile);
router.post("/follow/:id", isAuth, followAndUnfollow);
router.get("/followdata/:id", isAuth, followersAndFollowingsData);

export default router;

