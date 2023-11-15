import express from 'express';
import { getMovieByTitle, getResourceById, getSalon, getScreeningByTitle } from '../controllers/searchController.js';
import authFilter from '../filter/authFilter.js';

const router = express.Router();

router.get('/:type/:id', getResourceById);
router.get('/auth/admin/getSalon', authFilter.admin, getSalon);
router.get('/auth/admin/getMovie/:title', authFilter.admin, getMovieByTitle);
router.get('/auth/admin/getScreening/:title', authFilter.admin, getScreeningByTitle);

export default router;