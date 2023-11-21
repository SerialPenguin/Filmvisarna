import express from "express";
import { addMember, addMovie, addScreening, deleteMovie, deleteScreening, editMember, editMovie, getBookingByQuery, getMovieByTitle, getSalon, getScreeningByTitle, getUserByEmail, getUserById } from "../controllers/adminControllers.js";

const router = express.Router();

//GET REQUESTS
router.get('/getMovie/:title', getMovieByTitle);
router.get('/getSalon', getSalon);
router.get('/getScreening/:title', getScreeningByTitle);
router.get('/getBooking/:query', getBookingByQuery);
router.get('/hamta-anvandare-med-id/:id', getUserById);
router.get('/hamta-medlem/:email', getUserByEmail);

//POST REQUESTS
router.post('/addScreening', addScreening);
router.post('/addMovie', addMovie);
router.post("/lagg-till-medlem", addMember);

//PATCH REQUESTS
router.patch('/editMovie', editMovie);
router.patch('/redigera-medlem', editMember);

//DELETE REQUESTS
router.delete('/deleteMovie/:title', deleteMovie);
router.delete('/deleteScreening/:id', deleteScreening);


export default router;