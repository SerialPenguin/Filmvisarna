import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    emailAdress: String,
    password: String,
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { collection: "users" }
);

const User = mongoose.model("user", userSchema);

export default User;
