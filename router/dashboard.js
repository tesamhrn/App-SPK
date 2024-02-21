const express = require('express');
const router = express.Router();

const { dashboardPage, perhitunganPage } = require('../controllers/dashboardController');

router.get('/dashboard',dashboardPage);
router.get('/perhitungan',perhitunganPage);





module.exports = router;
