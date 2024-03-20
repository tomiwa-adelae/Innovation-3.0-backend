import express from "express";

import { sendEmailToAdmin } from "../controllers/contactController.js";

const router = express.Router();

// Article routes
router.post("/", sendEmailToAdmin);

export default router;
