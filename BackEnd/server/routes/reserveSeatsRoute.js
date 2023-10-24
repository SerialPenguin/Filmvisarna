import express from 'express';
import { reserveSeats } from '../controllers/reserveSeatsController';

const router = express.Router();

router.post('/', reserveSeats);

export default router;