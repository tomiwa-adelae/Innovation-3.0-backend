import asyncHandler from "express-async-handler";
import AuthUser from "../models/authModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await AuthUser.findOne({ email });
	// @ts-ignore
	if (user && (await user.matchPassword(password))) {
		// generateToken(res, user._id);
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Invalid email or password!");
	}
});

// @desc    Register new user & get token
// @route   POST /api/auth
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExist = await AuthUser.findOne({ email });

	if (userExist) {
		res.status(400);
		throw new Error("User already exists!");
	}

	const user = await AuthUser.create({
		name,
		email,
		password,
	});

	if (user) {
		// generateToken(res, user._id);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
		});
	} else {
		res.status(400);
		throw new Error("Internal server error!");
	}
});

export { loginUser, registerUser };
