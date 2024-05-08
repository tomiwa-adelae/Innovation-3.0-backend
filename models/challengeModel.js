import mongoose from "mongoose";

const challengeUserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		presentationType: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const ChallengeUser = mongoose.model("ChallengeUser", challengeUserSchema);
export default ChallengeUser;
