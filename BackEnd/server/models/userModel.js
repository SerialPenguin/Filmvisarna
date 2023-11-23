import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    emailAdress: String,
    password: String,
    bookingHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking", // Reference to the Booking model
      },
    ],
    userRole: String,
  },
  { collection: "users" }
);

const User = mongoose.model("user", userSchema);

export default User;
