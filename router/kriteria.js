const express = require('express');
const router = express.Router();

const kriteriaController = require('../controllers/kriteriaController');



router.get('/data-kriteria', kriteriaController.kriteriaPage);

router.post('/post-kriteria', kriteriaController.postKriteria);

// Route untuk menghapus kriteria
router.post('/delete-kriteria', kriteriaController.postDeleteKriteria);

module.exports = router;