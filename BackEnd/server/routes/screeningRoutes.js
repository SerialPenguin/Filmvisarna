import express from 'express';
import { addScreenings, deleteScreening, getAllScreenings } from '../controllers/screeningController.js';
import authFilter from '../filter/authFilter.js';

const router = express.Router();

router.get('/', getAllScreenings);
router.post('/auth/admin/addScreening', authFilter.admin, addScreenings);
router.delete('/auth/admin/deleteScreening/:id', authFilter.admin, deleteScreening);


export default router;