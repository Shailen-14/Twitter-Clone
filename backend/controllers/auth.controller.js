import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be more than 6 characters" });
    }

    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(newUser._id, res);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: "User signed up successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log(`Error in signup controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(404).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      message: "User logged in successfully",
      user: userResponse,
    });
  } catch (error) {
    console.log(`Error in login controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });

    return res.status(200).json({ message: "Logged out user successfully" });
  } catch (error) {
    console.log(`Error in logout controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById({ _id: userId }).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getMe controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

export { signup, login, logout, getMe };
