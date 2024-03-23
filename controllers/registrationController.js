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
					Subject: `Confirmation: Registration for Innovation 3.0`,
					TextPart: `Confirmation: Registration for Innovation 3.0`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h3>Dear ${name},</h3>
                                    <p>
										Congratulations! We are thrilled to inform you that your registration for the Innovation 3.0 Conference has been successfully confirmed. We are excited to have you join us for this dynamic event where cutting-edge ideas, groundbreaking technologies, and innovative strategies will be explored.
                                    </p>
                                    <strong>
                                        Event Details:
                                    </strong>
                                    <ul>
                                        <li>
                                            <strong>Conference name:</strong> Innovation 3.0
                                        </li>
                                        <li>
                                            <strong>Date:</strong> 10th of May, 2024
                                        </li>
                                        <li>
                                            <strong>Time:</strong> 9:00am - 2:00pm
                                        </li>
                                        <li>
                                            <strong>Location:</strong> Alakija Law Faculty Auditorium, Ajayi Crowther University, Oyo State
                                        </li>
                                    </ul>
									<strong>What to Expect:</strong>
									<p>
										At the Innovation 3.0, you will have the opportunity to engage with industry leaders, visionary speakers, and fellow innovators who are at the forefront of shaping the future. From keynote presentations to interactive workshops and networking sessions, the conference promises to inspire, educate, and empower attendees to drive innovation in their respective fields.
									</p>
									<strong>Additional Information:</strong>
                                    <ul>
										<li>
											Please remember to [bring any necessary materials / download the conference app / familiarize yourself with the virtual platform] in advance to ensure a smooth and enjoyable experience.
										</li>
										<li>
											Keep an eye on your inbox for any updates or important announcements leading up to the event.
										</li>
									</ul>
									<p>
										Once again, thank you for registering for the Innovation 3.0 Conference. We look forward to welcoming you and experiencing the future of innovation together.
									</p>
                                    <p>
                                        Best regards,
                                    </p>
                                    <p>John Ogunjide</p>
                                    <p>Convener of Innovation 3.0</p>
                                    <p>Innovation 3.0 & Cornerstone Foundations</p>
                                    <p>ogunjidejohn@gmail.com</p>
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
							Email: `tomiwaadelae6@gmail.com`,
							Name: `Innovation 3.0`,
						},
					],
					Subject: `Notification of Successful Registration for Innovation 3.0`,
					TextPart: `Notification of Successful Registration for Innovation 3.0`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h3>Dear John Ogunjide,</h3>
                                    <p>
									I hope this email finds you well. I am writing to inform you that we have received a new registration for the upcoming Innovation 3.0.
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
                                           <strong>Expectations:</strong> ${expectations}
                                        </li>
                                    </ul>
									<p>
									We are excited to have ${name} join us for this innovative event. As the convener of the Innovation 3.0, we thought you would like to be informed of the latest registrations.
									</p>
									
									<p>
									Thank you for your attention to this matter.
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

export { registerUser };
