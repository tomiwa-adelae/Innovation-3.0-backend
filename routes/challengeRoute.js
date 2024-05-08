import express from "express";
import { challengeUser } from "../controllers/challengeController.js";

const router = express.Router();

router.route("/").post(challengeUser);

export default router;
