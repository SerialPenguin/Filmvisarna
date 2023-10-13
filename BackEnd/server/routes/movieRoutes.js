import express from 'express';
import { getAllMovies } from '../controllers/movieController.js';
import authFilter from '../filter/authFilter.js';

const router = express.Router();

router.get('/', getAllMovies);

export default router;