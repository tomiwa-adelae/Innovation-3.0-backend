import dotenv from "dotenv";
dotenv.config();

import Mailjet from "node-mailjet";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_PUBLIC_KEY,
	process.env.MAILJET_API_PRIVATE_KEY
);

// Desc Register new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, phoneNumber, address, expectations } = req.body;

	// Admin email format
	const request = mailjet.post("send", { version: "v3.1" }).request({
		Messages: [
			{
				From: {
					Email: "thetommedia@gmail.com",
					Name: "Webmaster - Innovation 3.0",
				},
				To: [
					{
						Email: `innovation@gmail.com`,
						Name: `Innovation 3.0`,
					},
				],
				Subject: `Registration form submission - ${name}`,
				TextPart: `New Registration Form Submission - Innovation 3.0`,
				HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h1>Dear Innovation 3.0 team,</h1>
                                    <p>
                                        Exciting news! A new registration form submission has been successfully received via our website.
                                    </p>
                                    <p>
                                        The details are as follows:
                                    </p>
                                    <ul>
                                        <li>
                                            Name of Sender: ${name}
                                        </li>
                                        <li>
                                            Email Address: ${email}
                                        </li>
                                        <li>
                                            Phone number: ${phoneNumber}
                                        </li>
                                        <li>
                                            Address: ${address}
                                        </li>
                                        <li>
                                            Expectations: ${expectations}
                                        </li>
                                    </ul>
                                    <p>
                                        Thank you for your attention to this matter. Your commitment to student satisfaction is truly appreciated
                                    </p>
                                    <p>
                                        Best regards,
                                    </p>
                                    <p>Innovation 3.0</p>
                                </div>
                        `,
			},
		],
	});

	if (!name || !email || !phoneNumber || !address || !expectations) {
		res.status(400);
		throw new Error("Please enter all fields!");
	}

	if (phoneNumber.length != 11 || phoneNumber.charAt(0) !== "0") {
		res.status(400);
		throw new Error("Invalid phone number!");
	}

	const userExist = await User.findOne({ email });
	if (userExist) {
		res.status(400);
		throw new Error("You have once registered for Innovation 3.0!");
	}

	const user = await User.create({
		name,
		email,
		phoneNumber,
		address,
		expectations,
	});
	if (user) {
		res.status(201).json(
			{
				_id: user._id,
				name: user.name,
				email: user.email,
				phoneNumber: user.phoneNumber,
				address: user.address,
				expectations: user.expectations,
			},
			// Send email to admin
			request
				.then(() => {
					res.status(201).json({ msg: "Email sent successfully!" });
					return;
				})
				.catch((err) => {
					return err;
				})
		);
	} else {
		res.status(401);
		throw new Error("An error occurred! Please try again later");
	}
});

export { registerUser };
