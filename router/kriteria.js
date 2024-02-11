const express = require('express');
const router = express.Router();

const kriteriaController = require('../controllers/kriteriaController');



router.get('/data-kriteria', kriteriaController.kriteriaPage);

module.exports = router;