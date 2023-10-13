import express from 'express';
import { getResourceById } from '../controllers/searchController.js';

const router = express.Router();

router.get('/:type/:id', getResourceById);

export default router;