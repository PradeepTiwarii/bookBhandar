import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

//Connect to MongoDB
try {
    mongoose.connect(URI);
    console.log("Connected to MongoDB");
} catch (error) {
    console.log("Error : ", error);
}

app.use(cors());  // Allow all origins
app.use(express.json());

// defining route
app.use("/book", bookRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
