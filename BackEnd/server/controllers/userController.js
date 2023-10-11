import mongoose from "mongoose";
import User from "../models/userModel.js";

export const createUser = async (req, res) => {
  const { firstName, lastName, emailAdress, password } = req.body;

  const newUser = new User({
    firstName,
    lastName,
    emailAdress,
    password,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User successfully created!" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

// try {
//   const { firstName, lastName, emailAdress } = req.body;
//   console.log("Request body:", req.body);

//   const newUser = new User({
//     firstName: firstName,
//     lastName: lastName,
//     emailAdress: emailAdress,
//   });

//   await newUser.save();
//   console.log("User saved:", newUser);

//   res
//     .status(201)
//     .json({ message: "User created successfully!", user: newUser });
// } catch (error) {
//   console.error("Error creating booking:", error);
//   res.status(500).json({ error: "Internal server error" });
// }
