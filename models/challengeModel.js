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
		},
		address: {
			type: String,
		},
		category: {
			type: String,
			required: true,
		},
		presentationType: {
			type: String,
			required: true,
		},
		markChallenged: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const ChallengeUser = mongoose.model("ChallengeUser", challengeUserSchema);
export default ChallengeUser;
