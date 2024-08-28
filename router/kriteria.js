const express = require('express');
const router = express.Router();
const db = require('../utils/database');
const kriteriaController = require('../controllers/kriteriaController');



router.get('/data-kriteria', kriteriaController.kriteriaPage);

router.post('/post-kriteria', kriteriaController.postKriteria);

// Route untuk menghapus kriteria
router.post('/delete-kriteria', kriteriaController.postDeleteKriteria);

// Endpoint untuk mendapatkan data kriteria berdasarkan ID
router.get('/edit-kriteria/:id', kriteriaController.getKriteriaById);




module.exports = router;