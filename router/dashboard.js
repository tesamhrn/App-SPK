const express = require('express');
const router = express.Router();

const { dashboardPage, perhitunganPage, totalKaryawanJSON, totalKriteriaJSON , uploadProfile, profilePage} = require('../controllers/dashboardController');

// const { upload, uploadMultiple } = require('../middleware/multer');
const {upload} = require('../middleware/multer'); // Ubah path sesuai dengan lokasi penyimpanan multerConfig.js


router.get('/dashboard',dashboardPage);
router.get('/perhitungan',perhitunganPage);
router.get('/getTotalKaryawan',totalKaryawanJSON);
router.get('/getTotalKriteria',totalKriteriaJSON);
router.post('/uploadProfile', upload,uploadProfile);
router.get('/my-profile',profilePage);


module.exports = router;
