import express from 'express';
import { addScreenings, getAllScreenings } from '../controllers/screeningController.js';
import authFilter from '../filter/authFilter.js';

const router = express.Router();

router.get('/', getAllScreenings);
router.post('/auth/admin/addScreening', authFilter.admin, addScreenings)


export default router;