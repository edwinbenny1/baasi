import express from "express";
import { createRequirement } from "../controllers/requestController.js";

const router = express.Router();

// POST /api/requests
router.post("/", createRequirement);

export default router;
