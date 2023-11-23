import express from "express";
import {
  createUser,
  login,
  getUserInfo,
  deleteBooking,
  changePassword,
} from "../controllers/userController.js";
import authFilter from "../filter/authFilter.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.patch("/changePassword", changePassword)
router.get("/profile", authFilter.auth, getUserInfo);
router.delete("/bookings", authFilter.auth, deleteBooking);

export default router;
