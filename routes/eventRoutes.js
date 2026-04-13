import express from "express";
import {
  createEvent,
  getUserEvents,
  deleteEvent,
  updateEvent
} from "../controllers/eventController.js";

import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// Protected Routes
router.post("/", verifyToken, createEvent);
router.get("/", verifyToken, getUserEvents);
router.put("/:id", verifyToken, updateEvent);
router.delete("/:id", verifyToken, deleteEvent);

export default router;