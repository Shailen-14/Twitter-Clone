import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
  followUnfollowUser,
  getProfile,
  getSuggestedUsers,
  updateProfile,
  getFollowing,
  getFollowers
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateProfile);
router.get("/following", protectRoute, getFollowing);
router.get("/followers", protectRoute, getFollowers);

export default router;
