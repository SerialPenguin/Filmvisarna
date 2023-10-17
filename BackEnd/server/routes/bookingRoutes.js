import express from 'express';
import { bookSeat } from '../controllers/bookingController.js';
import { getAllBookings } from '../controllers/displayBookingController.js';

const router = express.Router();

router.patch('/', bookSeat);
router.get('/', getAllBookings);


export default router;