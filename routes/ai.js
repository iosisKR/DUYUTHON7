import express from "express";
import { analyzeStock, analyzeTrash, analyzeMove } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeTrash);
router.post("/analyzeStock", analyzeStock);
router.post("/analyzeMove", analyzeMove);
export default router;