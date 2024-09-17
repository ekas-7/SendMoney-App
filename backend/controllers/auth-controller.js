import User from "../models/user-model.js";
import { signupSchema, signinSchema } from "../middlewares/auth-validator.js";
import jwt from "jsonwebtoken";

export const sayHello = (req, res) => {
  try {
    res.status(200).json({ msg: "Hello world" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signUp = async (req, res) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({
          errors: validation.error.issues.map((issue) => issue.message),
        });
    }

    const { username, password, name } = validation.data;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ username, password, name });
    await newUser.save();
    const userId = newUser._id;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const validation = signinSchema.safeParse(req.body);
    if (!validation.success) {
      return res
        .status(400)
        .json({
          errors: validation.error.issues.map((issue) => issue.message),
        });
    }
    const { username, password } = validation.data;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isValidPassword = password === user.password;
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userId = user._id;
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
