import express from "express";
import {
  addVendor,
  getVendors,
  deleteVendor
} from "../controllers/vendorController.js";

import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

// Protected (optional but good)
router.post("/", verifyToken, addVendor);
router.get("/", verifyToken, getVendors);
router.delete("/:id", verifyToken, deleteVendor);

export default router;