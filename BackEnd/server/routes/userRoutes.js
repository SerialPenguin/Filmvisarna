import express from "express";
import { createUser, login } from "../controllers/userController.js";
import { userProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", login);
router.get("/profile/:id", userProfile);

export default router;
