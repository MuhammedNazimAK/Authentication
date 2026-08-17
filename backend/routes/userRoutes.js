import express from 'express';
import { isAuth } from '../middleware/isAuth.js';
import { followAndUnfollow, followersAndFollowingsData, getAllUsers, myProfile, searchUsers, updatePassword, updateProfile, userProfile } from '../controllers/userController.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();

router.get('/me', isAuth, myProfile);
router.get("/all", isAuth, getAllUsers);
router.get("/search", isAuth, searchUsers);
router.get('/:id', isAuth, userProfile);
router.put('/profile/:id', isAuth, uploadFile, updateProfile);
router.post('/password/:id', isAuth, updatePassword);
router.post("/follow/:id", isAuth, followAndUnfollow);
router.get("/followdata/:id", isAuth, followersAndFollowingsData);

export default router;

