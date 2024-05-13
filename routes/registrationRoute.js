import express from "express";
import {
	registerUser,
	getUsers,
	markAsAttended,
	adminRegisterUser,
} from "../controllers/registrationController.js";

const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.route("/create").post(adminRegisterUser);
router.route("/mark-attended").post(markAsAttended);

export default router;
