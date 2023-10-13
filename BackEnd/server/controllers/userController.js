import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const secretKey = process.env.SECRET;

export const createUser = async (req, res) => {
  const { firstName, lastName, emailAdress, password } = req.body;

  const newUser = new User({
    firstName,
    lastName,
    emailAdress,
    password,
    bookingHistory: [],
    userRole: "USER",
  });

  try {
    const user = await User.findOne({ emailAdress });
    if (user) {
      res
        .status(401)
        .json({ error: "Email address taken, login or try another email." });
    } else {
      await newUser.save();
      res.status(201).json({ message: "User successfully created!" });
    }
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const login = async (req, res) => {
  const { emailAdress, password } = req.body;

  const user = await User.findOne({ emailAdress });

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  if (user && password != user.password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ id: user._id }, secretKey);
  res.json({ token });
};
