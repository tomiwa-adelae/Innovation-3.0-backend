import express from "express";
import {
	registerUser,
	getUsers,
	markAsAttended,
} from "../controllers/registrationController.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.route("/mark-attended").post(markAsAttended);

export default router;
