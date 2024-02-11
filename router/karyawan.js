const express = require('express');
const router = express.Router();

const karyawanController = require('../controllers/karyawanController');
const penilaianController = require('../controllers/penilaianController');


router.get('/data-karyawan', karyawanController.karyawanViewPage);
router.get('/tambah-karyawan', karyawanController.addKaryawanPage);

// router.post('/postCreate_Account', createAdminAccount)

// router.post('/postLogin_User', postLoginUser)

router.get('/data-penilaian-karyawan',penilaianController.karyawanViewPage)
module.exports = router;