import bcrypt from 'bcryptjs';  // Import bcrypt for password hashing
import User from "../model/user.model.js";
const { compare } = bcrypt;

export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password using bcrypt before saving
        const salt = await bcrypt.genSalt(10);  // Generate salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

        // Create a new user object with the hashed password
        const createUser = new User({
            fullname,
            email,
            password: hashedPassword  // Save the hashed password
        });

        // Save the new user to the database
        await createUser.save();

        // Respond with a success message
        res.status(201).json({ message: "User created successfully", user:{
            _id: createUser._id,
            fullname: createUser.fullname,
            email: createUser.email,
        } });

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Internal Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists or not
        const user = await User.findOne({ email });

        // If user doesn't exist
        if (!user) {
            return res.status(400).json({ message: "Invalid user email" });
        }

        // Compare the entered plain password with the hashed password from the database
        const isMatch = await compare(password, user.password);

        // If password doesn't match
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // If login is successful
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
