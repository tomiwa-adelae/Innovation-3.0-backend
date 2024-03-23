import dotenv from "dotenv";
dotenv.config();

import asyncHandler from "express-async-handler";

import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_PUBLIC_KEY,
	process.env.MAILJET_API_PRIVATE_KEY
);

// @Desc Send email to admin about a new contact
// @route POST /api/contact
// @access Public
const sendEmailToAdmin = asyncHandler(async (req, res) => {
	try {
		const { name, email, phoneNumber, message } = req.body;

		if (!name || !email || !phoneNumber) {
			res.status(400);
			throw new Error("Please enter all fields!");
		}

		if (phoneNumber.length != 11 || phoneNumber.charAt(0) !== "0") {
			res.status(400);
			throw new Error("Invalid phone number!");
		}

		// Admin email format
		const request = mailjet.post("send", { version: "v3.1" }).request({
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
					Subject: `Notification: Contact Form Submission Received`,
					TextPart: `Notification: Contact Form Submission Received`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h1>Dear John Ogunjide,</h1>
                                    <p>
									I hope this email finds you well. I wanted to inform you that we have received a new submission via the contact page of our website.
                                    </p>
                                    <p>
                                        Here are the Details provided:
                                    </p>
                                    <ul>
                                        <li>
                                            <strong>Name:</strong> ${name}
                                        </li>
                                        <li>
                                            <strong>Email Address:</strong> ${email}
                                        </li>
                                        <li>
                                            <strong>Phone number:</strong> ${phoneNumber}
                                        </li>
                                        <li>
                                            <strong>Message:</strong> ${message}
                                        </li>
                                    </ul>
									<p>It's always encouraging to see interest and engagement from our audience, and I wanted to ensure you were aware of this interaction.</p>
                                    <p>
                                        Thank you for your attention to this matter. Your commitment to student's satisfaction is truly appreciated
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

		// Send email to admin
		request
			.then(() => {
				res.status(201).json({
					success:
						"Email sent successfully! Our team would get back to you shortly",
				});
				return;
			})
			.catch((err) => {
				return err;
			});
	} catch (err) {
		res.status(400);
		throw new Error(err);
	}
});

export { sendEmailToAdmin };
