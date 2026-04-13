import express from "express";
import { addPayment, getPayments } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.post("/", verifyToken, addPayment);
router.get("/", verifyToken, getPayments);

export default router;