const express = require('express');
const { PerbandinganKriteriaPage } = require('../controllers/perhitunganController');

const router = express.Router();


router.get('/perbandingan-kriteria', PerbandinganKriteriaPage)


module.exports = router;