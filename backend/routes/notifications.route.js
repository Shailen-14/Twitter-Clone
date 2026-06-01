import express from "express";
import {
  deleteNotifications,
  getNotifications,
} from "../controllers/notifications.controller.js";
import { protectRoute } from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotifications);

export default router;
