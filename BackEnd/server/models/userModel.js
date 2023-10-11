import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    emailAdress: String,
    password: String,
    bookingHistory: Array,
  },
  { collection: "users" }
);

const User = mongoose.model("user", userSchema);

export default User;
