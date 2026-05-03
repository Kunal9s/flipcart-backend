import User from "../model/user-schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

export const userSignup = async (req, res) => {
  try {
    const exist = await User.findOne({ username: req.body.username });
    if (exist) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    });
    console.log(req.body);
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login input:", username, password);

    if (!username || !password) {
      return res.status(400).json("Please enter all fields");
    }

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });
    console.log("User from DB:", user);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json("Invalid password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
