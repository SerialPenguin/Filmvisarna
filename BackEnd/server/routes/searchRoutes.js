import express from 'express';
import { getBookingByQuery, getMovieByTitle, getResourceById, getSalon, getScreeningByTitle, getUserById } from '../controllers/searchController.js';
import authFilter from '../filter/authFilter.js';

const router = express.Router();

router.get('/:type/:id', getResourceById);
router.get('/auth/admin/getBooking/:query', authFilter.admin, getBookingByQuery);
router.get('/auth/admin/getSalon', authFilter.admin, getSalon);
router.get('/auth/admin/getMovie/:title', authFilter.admin, getMovieByTitle);
router.get('/auth/admin/getScreening/:title', authFilter.admin, getScreeningByTitle);
router.get('/auth/admin/getUser/:id', authFilter.admin, getUserById);

export default router;