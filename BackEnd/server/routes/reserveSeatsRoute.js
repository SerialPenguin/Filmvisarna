import express from 'express';
import { reserveSeats, getTemporaryBookings } from '../controllers/temporarySeatsController';

const router = express.Router();

router.post('/', reserveSeats);
router.get('/:screeningId', getTemporaryBookings);


export default router;

