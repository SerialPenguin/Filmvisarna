import express from 'express';
import { editMovies, addMovies, getAllMovies, deleteMovies } from '../controllers/movieController.js';
import authFilter from '../filter/authFilter.js'; 

const router = express.Router();

router.get('/', getAllMovies);
router.post('/auth/admin/addMovie', authFilter.admin, addMovies);
router.patch('/auth/admin/editMovie', authFilter.admin, editMovies);
router.delete('/auth/admin/deleteMovie/:title', authFilter.admin, deleteMovies);

export default router;