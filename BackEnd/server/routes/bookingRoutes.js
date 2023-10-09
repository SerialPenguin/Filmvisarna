import express from 'express';
import { bookSeat } from '../controllers/bookingController.js';

const router = express.Router();

router.patch('/', bookSeat);

export default router;