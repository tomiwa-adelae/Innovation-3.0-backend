import dotenv from "dotenv";
dotenv.config();

import Mailjet from "node-mailjet";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

import ChallengeUser from "../models/challengeModel.js";

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_PUBLIC_KEY,
	process.env.MAILJET_API_PRIVATE_KEY
);

// Desc Register new challenge user
// @route POST /api/challenge
// @access public
const challengeUser = asyncHandler(async (req, res) => {
	const { name, email, phoneNumber, category, presentationType, address } =
		req.body;

	if (
		!name ||
		!email ||
		!address ||
		!phoneNumber ||
		!category ||
		!presentationType
	) {
		res.status(400);
		throw new Error("Please enter all fields!");
	}

	if (phoneNumber.length != 11 || phoneNumber.charAt(0) !== "0") {
		res.status(400);
		throw new Error("Invalid phone number!");
	}

	const challengeUserExist = await ChallengeUser.findOne({ email });
	if (challengeUserExist) {
		res.status(400);
		throw new Error("You have already registered for a challenge!");
	}

	const challengeUser = await ChallengeUser.create({
		name,
		email,
		phoneNumber,
		category,
		address,
		presentationType,
	});
	if (challengeUser) {
		// Registered User email format
		const request = mailjet.post("send", { version: "v3.1" }).request({
			Messages: [
				{
					From: {
						Email: "webmasterthetommedia@gmail.com",
						Name: "Innovation 3.0",
					},
					To: [
						{
							Email: `${email}`,
							Name: `Innovation 3.0`,
						},
					],
					Subject: `Confirmation: Innovation 3.0 Challenge`,
					TextPart: `Confirmation: Innovation 3.0 Challenge successfully submitted`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h3>Dear ${name},</h3>
                                    <p>
									Congratulations! We are thrilled to inform you that your registration for the Innovation Challenge at the Innovation 3.0 Conference has been successfully confirmed. Get ready to showcase your innovative prowess and make a difference!
                                    </p>
                                    <strong>
                                        Event Details:
                                    </strong>
                                    <ul>
                                        <li>
                                            <strong>Challenge name:</strong> Innovation Challenge
                                        </li>
                                        <li>
                                            <strong>Challenge category:</strong> ${category}
                                        </li>
                                        <li>
                                            <strong>Presentation type:</strong> ${presentationType}
                                        </li>
                                        <li>
                                            <strong>Location:</strong> Alakija Law Faculty Auditorium, Ajayi Crowther University, Oyo State
                                        </li>
                                    </ul>
									<strong>What to Expect:</strong>
									<p>
									The Innovation Challenge promises to be an exhilarating opportunity to put your creativity and problem-solving skills to the test. Prepare to collaborate with like-minded individuals, tackle real-world challenges, and present your solutions to a panel of esteemed judges.
									</p>
									<strong>Next Steps:</strong>
                                    <ul>
										<li>
										Stay tuned for updates and announcements leading up to the challenge. We'll be sharing important information regarding the challenge prompt, format, and any additional resources you may need.
										</li>
										<li>
										If you have any questions or require assistance, please don't hesitate to reach out to us at <a href="https://www.innovationconference.com.ng/contact">Contact page | Innovation 3.0</a>. Our team is here to support you every step of the way.
										</li>
									</ul>
									<p>
									Thank you for registering for the Innovation Challenge. We can't wait to witness the innovative solutions you bring to the table and the positive impact they will have.
									</p>
                                    <p>
                                        Best regards,
                                    </p>
                                    <p>John Ogunjide</p>
                                    <p>Convener of Innovation 3.0</p>
                                    <p>Innovation 3.0 & Cornerstone Foundations</p>
                                    <p>cornerstonefountains@gmail.com</p>
                                </div>
                        `,
				},
			],
		});

		// Admin email format
		const requestAdmin = mailjet.post("send", { version: "v3.1" }).request({
			Messages: [
				{
					From: {
						Email: "webmasterthetommedia@gmail.com",
						Name: "Innovation 3.0",
					},
					To: [
						{
							Email: `cornerstonefountains@gmail.com`,
							Name: `Innovation 3.0`,
						},
					],
					Subject: `Notification of Successful Registration for Innovation Challenge`,
					TextPart: `Notification of Successful Registration for Innovation Challenge`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h3>Dear Innovation Team,</h3>
                                    <p>
									Congratulations! We are thrilled to inform you that your registration for the Innovation Challenge at the Innovation 3.0 Conference has been successfully confirmed. Get ready to showcase your innovative prowess and make a difference!
                                    </p>
                                    <strong>
									Registrant Details:
                                    </strong>
                                    <ul>
                                        <li>
                                            <strong>Name:</strong> ${name}
                                        </li>
                                        <li>
                                            <strong>Email address:</strong> ${email}
                                        </li>
                                        <li>
                                            <strong>Phone number:</strong> ${phoneNumber}
                                        </li>
										<li>
											<strong>Address:</strong> ${address}
										</li>
                                        <li>
                                            <strong>Category chosen:</strong> ${category}
                                        </li>
                                        <li>
                                           <strong>Presentation type:</strong> ${presentationType}
                                        </li>
                                    </ul>
									<p>
									We are excited to have <strong>${name}</strong> join us for this innovation challenge. As the convener of the Innovation 3.0, we thought you would like to be informed of the latest registrations.
									</p>
									
									<p>
									Thank you for your attention to this matter.
									</p>
                                    <p>
                                        Best regards,
                                    </p>
                                    <p>Innovation 3.0</p>
                                    <p>Cornerstone International Foundations</p>
                                </div>
                        `,
				},
			],
		});

		// Send email to user
		request
			.then(() => {
				res.status(201).json({
					success:
						"Success! Please check your inbox for more details.",
				});
				return;
			})
			.catch((err) => {
				return err;
			});
		// Send email to admin
		requestAdmin
			.then(() => {
				res.status(201);
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		res.status(401);
		throw new Error("An error occurred! Please try again later");
	}
});

// Desc Get all users/attendees
// @route GET /api/users
// @access Private
const getChallengers = asyncHandler(async (req, res) => {
	const keyword = req.query.keyword
		? {
				$or: [
					{
						name: {
							$regex: req.query.keyword,
							$options: "i",
						},
					},
					{
						email: {
							$regex: req.query.keyword,
							$options: "i",
						},
					},
				],
		  }
		: {};

	const users = await ChallengeUser.find({ ...keyword }).sort({
		createdAt: -1,
	});
	// .limit(10);

	res.status(200).json(users);
});

const markAsChallenged = asyncHandler(async (req, res) => {
	const { id } = req.body;

	const user = await ChallengeUser.findById(id);

	if (user) {
		user.markChallenged = true;

		await user.save();

		res.status(200).json({ success: "Challenged!" });
	} else {
		res.status(400);
		throw new Error("Internal server error!");
	}
});

// Desc Register new challenge user
// @route POST /api/chalenge/create
// @access public
const adminRegisterChallengeUser = asyncHandler(async (req, res) => {
	const {
		name,
		email,
		phoneNumber,
		address,
		category,
		presentationType,
		markAttendance,
	} = req.body;

	if (!name || !category || !presentationType) {
		res.status(400);
		throw new Error("Please enter all fields!");
	}

	const user = await ChallengeUser.create({
		name,
		email: email || uuidv4(),
		phoneNumber,
		category,
		address,
		presentationType,
		markAttendance,
	});
	if (user) {
		res.status(200).json({ success: "Success! Registration successful." });
	} else {
		res.status(401);
		throw new Error("An error occurred! Please try again later");
	}
});

export {
	challengeUser,
	getChallengers,
	markAsChallenged,
	adminRegisterChallengeUser,
};
