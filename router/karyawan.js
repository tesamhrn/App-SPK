const express = require('express');
const router = express.Router();

const karyawanController = require('../controllers/karyawanController');
const penilaianController = require('../controllers/penilaianController');


router.get('/data-karyawan', karyawanController.karyawanViewPage);
router.get('/tambah-karyawan', karyawanController.addKaryawanPage);

// router.post('/postCreate_Account', createAdminAccount)

router.post('/postKaryawanForm', karyawanController.postKaryawanData);

router.get('/data-penilaian-karyawan',penilaianController.karyawanViewPage)

router.get('/NhgdjgfNVGzvczYDF/form-pengisian-karyawan',(_,res)=>{
   
    const messagePost = _.flash('postInfo');
    res.render('form_karyawan',{
        messagePost
    });

});

module.exports = router;