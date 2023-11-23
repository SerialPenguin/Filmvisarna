import express from 'express';
import { reserveSeats, getTemporaryBookings, deleteSeats } from '../controllers/temporarySeatsController';

const router = express.Router();

router.post('/', reserveSeats);
router.get('/:screeningId', getTemporaryBookings);
router.delete('/deleteSeats', deleteSeats)


export default router;

