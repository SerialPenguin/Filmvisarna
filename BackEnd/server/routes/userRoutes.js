import express from "express";
import {
  createUser,
  login,
  getUserInfo,
  deleteBooking,
} from "../controllers/userController.js";
import auth from "../filter/authFilter.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/profile", auth, getUserInfo);
router.delete("/bookings", auth, deleteBooking);

export default router;
