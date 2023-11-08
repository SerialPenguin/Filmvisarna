import express from 'express';
import { addMovies, getAllMovies } from '../controllers/movieController.js';
import authFilter from '../filter/authFilter.js'; 

const router = express.Router();

router.get('/', getAllMovies);
router.post('/auth/admin/addMovie', authFilter.admin, addMovies);

export default router;