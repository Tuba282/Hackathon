import express from "express";
import { getAllHijabStyles, createHijabStyle } from "../controllers/hijabStyleController.js";
import { middlewareToProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllHijabStyles);
router.post("/create", middlewareToProtect, createHijabStyle); // Only logged in users

export default router;
