import express from 'express';
import sendConfirmation from '../controllers/nodeMailerController.js';

const router = express.Router();

router.post('/', sendConfirmation);

export default router;