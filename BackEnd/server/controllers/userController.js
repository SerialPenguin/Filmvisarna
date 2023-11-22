import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js";
import Screening from "../models/screeningModel.js";
import bcrypt from "bcrypt";

const secretKey = process.env.SECRET;

export const createUser = async (req, res) => {
  const { firstName, lastName, emailAdress, password } = req.body;

  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const newUser = new User({
      firstName,
      lastName,
      emailAdress,
      password: hashedPassword, // Store the hashed password
      bookingHistory: [],
      userRole: "USER",
    });

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
    res
      .status(401)
      .json({ error: "Ingen användare med denna e-postadress hittades" });
    return;
  }

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ error: "Fel lösenord eller e-postadress" });
    return;
  }

  const token = jwt.sign({ id: user._id }, secretKey);
  res.status(200).json({ token });
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
    const bookingId = req.body.bookingId;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the booking exists in the user's bookingHistory
    const bookingIndex = user.bookingHistory.indexOf(bookingId);

    if (bookingIndex === -1) {
      return res
        .status(404)
        .json({ error: "Booking not found in user history" });
    }

    // Get the booking information
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Retrieve the screening ID
    const screeningId = booking.screeningId;

    // Remove the booking from the user's bookingHistory
    user.bookingHistory.splice(bookingIndex, 1);

    await user.save();

    // Remove the booking from the database
    await Booking.findByIdAndRemove(bookingId);

    // Update the screening to remove the deleted booking
    await Screening.updateOne(
      { _id: screeningId },
      { $pull: { bookings: bookingId } }
    );

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

