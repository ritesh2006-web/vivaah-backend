import express from "express";
import { getReport } from "../controllers/reportController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", verifyToken, getReport);

export default router;
