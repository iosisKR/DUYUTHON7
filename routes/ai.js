import express from "express";
import { analyzeTrash } from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", analyzeTrash);

export default router;