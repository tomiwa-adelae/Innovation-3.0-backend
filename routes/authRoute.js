import express from "express";

import { loginUser, registerUser } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User controller routes
router.post("/", registerUser);
router.post("/login", loginUser);

export default router;
