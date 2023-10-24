import express from 'express';
import { getSeats } from '../controllers/seatsController.js';

const router = express.Router();

router.get('/seats/:salonId?', getSeats);

export default router;