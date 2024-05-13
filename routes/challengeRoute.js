import express from "express";
import {
	challengeUser,
	getChallengers,
	markAsChallenged,
	adminRegisterChallengeUser,
} from "../controllers/challengeController.js";

const router = express.Router();

router.route("/").post(challengeUser).get(getChallengers);
router.route("/create").post(adminRegisterChallengeUser);
router.route("/mark-challenged").post(markAsChallenged);

export default router;
