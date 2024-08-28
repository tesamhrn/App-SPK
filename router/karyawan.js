const express = require('express');
const router = express.Router();
const db = require('../utils/database');

const karyawanController = require('../controllers/karyawanController');
// const penilaianController = require('../controllers/penilaianCkontroller');
// router.get('/data-penilaian-karyawan',penilaianController.karyawanViewPage)


router.get('/data-karyawan', karyawanController.karyawanPage);
router.get('/tambah-karyawan', karyawanController.addKaryawanPage);
router.get('/edit-karyawan/:id', karyawanController.getKaryawanById);

// router.post('/postCreate_Account', createAdminAccount)

router.post('/postKaryawan_ByAdm', karyawanController.postKaryawanDataAdm);
router.post('/postKaryawanForm', karyawanController.postKaryawanData);
// Rute untuk mengambil data dari database dan membuat PDF
router.get('/create-pdf', karyawanController.getDataFromDatabase);

// Rute untuk mengonversi data ke format Excel
router.get('/convert-to-excel', karyawanController.convertToExcel);

// Route untuk menghapus karyawan
router.post('/delete-karyawan', karyawanController.postDeleteKaryawan);

router.post('/update-bobot', karyawanController.tambahBobot);

// Rute untuk mengonversi data ke format docx
// router.get('/convert-to-docx', karyawanController.convertToDocx);

// Endpoint untuk mengambil data dari database
router.get('/get-data-from-database', (req, res) => {
    // Lakukan query ke database untuk mengambil data karyawan
    db.query('SELECT * FROM karyawan', (err, result) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Kirim data sebagai respons
        res.json(result);
    });
});

router.get('/NhgdjgfNVGzvczYDF/form-pengisian-karyawan',(_,res)=>{
   
    const messagePost = _.flash('postInfo');
    res.render('form_karyawan',{
        messagePost
    });

});


router.get('/tambah-bobot-karyawan/:id', karyawanController.ubahBobotAlternatif)



router.get('/rel_alternatif', karyawanController.renderRelAlternatif)
router.get('/data-kosong-test', karyawanController.getBobotKosong)
/*  ROUTER BAGIAN UNTUK NILAI BOBOT ALTERNATIF  */

// router.get('endpoint-getkriteria_count', karyawanController)


function hitungPerbandinganKriteria(kriteria_1, nilai, kriteria_2) {
    // Menghitung bobot kriteria
    const bobot_kriteria_1 = 1 / nilai;
    const bobot_kriteria_2 = nilai;

    // Menghitung perbandingan kriteria
    const perbandingan_kriteria = bobot_kriteria_1 / bobot_kriteria_2;

    // Mengembalikan hasil perbandingan kriteria
    return perbandingan_kriteria;
}

router.post('/hitung-perbandingan-kriteria', (req, res) => {
    // Mendapatkan data perbandingan kriteria dari body request
    const { kriteria_1, nilai, kriteria_2 } = req.body;

    // Validasi input, pastikan tidak ada yang kosong
    if (!kriteria_1 || !nilai || !kriteria_2) {
        return res.status(400).json({ error: 'Semua input harus diisi.' });
    }

    // Validasi tambahan: jika nama kriteria sama dan nilainya lebih dari 1, atur nilainya menjadi 1
    if (kriteria_1 === kriteria_2 && parseFloat(nilai) > 1) {
        // Nilai kriteria sama dengan 1
        const hasilPerbandingan = hitungPerbandinganKriteria(kriteria_1, 1, kriteria_2);
        return res.json({ hasilPerbandingan });
    }

    // Memanggil fungsi hitungPerbandinganKriteria dengan input yang diberikan
    const hasilPerbandingan = hitungPerbandinganKriteria(kriteria_1, nilai, kriteria_2);

    // Mengembalikan hasil perhitungan sebagai respons
    res.json({ hasilPerbandingan });
});



module.exports = router;