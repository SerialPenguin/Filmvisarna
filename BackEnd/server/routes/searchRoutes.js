import express from 'express';
import { getMovieByTitle, getResourceById } from '../controllers/searchController.js';

const router = express.Router();

router.get('/:type/:id', getResourceById);
router.get('/admin/getMovie/:title', getMovieByTitle);

export default router;