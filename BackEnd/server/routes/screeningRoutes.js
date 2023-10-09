const express = require('express');
const screeningController = require('../controllers/screeningController');
const router = express.Router();

router.get('/', screeningController.getAllScreenings);

module.exports = router;