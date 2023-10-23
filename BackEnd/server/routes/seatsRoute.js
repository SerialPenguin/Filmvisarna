import express from 'express';
import { getSeats } from '../controllers/seatsController.js';

const router = express.Router();

router.get('/api/seats/:salonId?', getSeats);

export default router;