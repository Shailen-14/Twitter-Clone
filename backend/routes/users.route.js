import express from "express";
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import {
  followUnfollowUser,
  getProfile,
  getSuggestedUsers,
  updateProfile,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/profile/:username", protectRoute, getProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateProfile);

export default router;
