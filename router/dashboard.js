const express = require('express');
const router = express.Router();

const { dashboardPage } = require('../controllers/dashboardController');

router.get('/dashboard',dashboardPage);





module.exports = router;
