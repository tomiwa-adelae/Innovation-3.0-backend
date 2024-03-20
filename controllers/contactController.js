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
					Subject: `Contact form submission - ${name}`,
					TextPart: `New Contact Form Submission - Innovation 3.0`,
					HTMLPart: `<div 
                                    style="
                                        font-family: Montserrat, sans-serif;
                                        font-size: 15px;
                                    "
                                >
                                    <h1>Dear Innovation 3.0 team,</h1>
                                    <p>
                                        Exciting news! A new contact form submission has been successfully received via our website.
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
                                            Message: ${message}
                                        </li>
                                    </ul>
                                    <p>
                                        Thank you for your attention to this matter. Your commitment to student satisfaction is truly appreciated
                                    </p>
                                    <p>
                                        Best regards,
                                    </p>
                                    <p>Innovation</p>
                                </div>
                        `,
				},
			],
		});

		// Send email to admin
		request
			.then(() => {
				res.status(201).json({ msg: "Email sent successfully!" });
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
