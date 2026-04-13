import express from "express";
import {
  createBooking,
  getBookings,
  cancelBooking
} from "../controllers/bookingController.js";

import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);
router.delete("/:id", verifyToken, cancelBooking);

export default router;