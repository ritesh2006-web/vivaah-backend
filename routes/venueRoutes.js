import express from "express";
import { getVenues, addVenue, updateVenue, deleteVenue, bookVenue } from "../controllers/venueController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// 🔹 GET ALL VENUES
router.get("/", verifyToken, getVenues);

// 🔹 ADD VENUE
router.post("/", verifyToken, addVenue);

// 🔹 BOOK VENUE FOR EVENT
router.post("/book", verifyToken, bookVenue);

// 🔹 UPDATE VENUE
router.put("/:id", verifyToken, updateVenue);

// 🔹 DELETE VENUE
router.delete("/:id", verifyToken, deleteVenue);

export default router;