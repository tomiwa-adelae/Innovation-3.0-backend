import dotenv from "dotenv";
dotenv.config();

import express from "express";

import cors from "cors";

// Import MongoDB connection file
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Importing the routes
import contactRoute from "./routes/contactRoute.js";
import registrationRoute from "./routes/registrationRoute.js";

// Initialize express app
const app = express();

// Cross origin requests
app.use(cors());

// Express body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
connectDB();

// API routes

app.use("/api/contact", contactRoute);
app.use("/api/register", registrationRoute);

app.get("/", (req, res) => {
	res.send("Yes! I'm back up");
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
