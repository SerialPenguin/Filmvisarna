import express from "express";
import { addMember, addMovie, addScreening, deleteMovie, deleteScreening, deleteUser, editMember, editMovie, getBookingByQuery, getMovieByTitle, getSalon, getScreeningByTitle, getUserByEmail, getUserById } from "../controllers/adminControllers.js";

const router = express.Router();

//GET REQUESTS
router.get('/getMovie/:title', getMovieByTitle);
router.get('/getSalon', getSalon);
router.get('/getScreening/:title', getScreeningByTitle);
router.get('/getBooking/:query', getBookingByQuery);
router.get('/getUserById/:id', getUserById);
router.get('/getUserByEmail/:email', getUserByEmail);

//POST REQUESTS
router.post('/addScreening', addScreening);
router.post('/addMovie', addMovie);
router.post("/addMember", addMember);

//PATCH REQUESTS
router.patch('/editMovie', editMovie);
router.patch('/editMember', editMember);

//DELETE REQUESTS
router.delete('/deleteMovie/:title', deleteMovie);
router.delete('/deleteScreening/:id', deleteScreening);
router.delete('/deleteUser/:id', deleteUser);


export default router;