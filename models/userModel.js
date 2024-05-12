import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
		},
		phoneNumber: {
			type: String,
		},
		address: {
			type: String,
		},
		institution: {
			type: String,
		},
		expectations: {
			type: String,
		},
		markAttendance: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
