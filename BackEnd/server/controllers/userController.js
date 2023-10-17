import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Booking from '../models/bookingModel.js';

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

export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookingId = req.params.bookingId;
    console.log('bookingId:', bookingId);
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the booking exists in the user's bookingHistory
    const bookingIndex = user.bookingHistory.indexOf(bookingId);

    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found in user history' });
    }

    // Get the booking information
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Remove the booking from the user's bookingHistory
    user.bookingHistory.splice(bookingIndex, 1);

    await user.save();

    // Remove the booking from the database
    await Booking.findByIdAndRemove(bookingId);

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const logoutUser = (req, res) => {
  const token = req.headers.authorization; // Assuming the token is passed in the Authorization header

  // Check if the token is already invalidated
  if (invalidatedTokens.has(token)) {
    return res.status(401).json({ error: 'Token already invalidated' });
  }

  // Add the token to the blacklist
  invalidatedTokens.add(token);

  res.json({ message: 'User logged out successfully' });
};