import express from "express";
import { addGuest, getGuests, updateGuestStatus, deleteGuest } from "../controllers/guestController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", verifyToken, addGuest);
router.get("/", verifyToken, getGuests);
router.put("/:id", verifyToken, updateGuestStatus);
router.delete("/:id", verifyToken, deleteGuest);

export default router;