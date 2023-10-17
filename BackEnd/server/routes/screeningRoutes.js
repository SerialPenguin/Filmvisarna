import express from 'express';
import { getAllScreenings } from '../controllers/screeningController.js';

const router = express.Router();

router.get('/', getAllScreenings);


export default router;