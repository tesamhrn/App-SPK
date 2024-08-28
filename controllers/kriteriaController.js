const db = require('../utils/database');



function AHP_get_nilai_option(selected = '') {
    const nilai = {
        '1': 'Sama penting dengan',
        '2': 'Mendekati sedikit lebih penting dari',
        '3': 'Sedikit lebih penting dari',
        '4': 'Mendekati lebih penting dari',
        '5': 'Lebih penting dari',
        '6': 'Mendekati sangat penting dari',
        '7': 'Sangat penting dari',
        '8': 'Mendekati mutlak dari',
        '9': 'Mutlak sangat penting dari',
    };

    const options = Object.entries(nilai).map(([key, value]) => ({
        value: key,
        label: `${key} - ${value}`
    }));

    return options;
}

exports.kriteriaPage = (req, res) => {
    const locals = {
        title: "Data Kriteria",
        description: "data kriteria SPK AHP & TOPSIS"
    };
    const readQuery = 'SELECT * FROM kriteria';

    db.query(readQuery, (err, resultsRead) => {
        if (err) {
            res.status(500);
        } else if (!err) {
            const messagePost = req.flash('postInfo');
            const messageDelete = req.flash('deleteInfo');
            const messageCheck = req.flash('postCheckInfo');
            const nilaiOptions = AHP_get_nilai_option();

            res.render('data_kriteria', {
                locals,
                messagePost,
                messageDelete,
                messageCheck,
                kriteriaData: resultsRead,
                nilaiOptions
            });
        }
    });
};


// Endpoint untuk mendapatkan data kriteria berdasarkan ID
exports.getKriteriaById = (req, res) => {
    const id = req.params.id; // Ambil ID dari parameter URL

    // Query database untuk mendapatkan data kriteria berdasarkan ID
    const query = 'SELECT * FROM kriteria WHERE id_kriteria = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            // Tangani kesalahan jika terjadi
            console.error('Error fetching kriteria:', err);
            res.status(500).send('Error fetching kriteria');
        } else {
            // Kirim data kriteria sebagai respons
            // res.json(result[0]); // Ambil hasil pertama dari array hasil
            res.render('edit_kriteria',{
                kriteriaData : result[0]
                // resultk
            })
        }
    });
};






// exports.postKriteria = (req,res)=>{
//     // const {nama_kriteria} = req.body;

    
//     const kriteriaField = {
//         nama_kriteria : req.body.nama_kriteria
//     }

//     const insertQuery = 'INSERT INTO kriteria SET ?'

//     db.query(insertQuery, kriteriaField,(err,results)=>{
//         if(err){
//             res.status(500);
//         }

//         else if(!err){


//             req.flash('postInfo', 'Data kriteria berhasil di upload');
//             res.redirect('/data/data-kriteria');
//         }
//     })
// }



exports.postKriteria = (req, res) => {
    const kriteriaField = {
        nama_kriteria: req.body.nama_kriteria
    };

        // Query untuk memeriksa apakah kriteria dengan nama yang sama sudah ada
        const checkQuery = 'SELECT * FROM kriteria WHERE nama_kriteria = ?';
        db.query(checkQuery, kriteriaField.nama_kriteria, (err, results) => {
            if (err) {
                console.error('Terjadi kesalahan saat memeriksa kriteria:', err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa kriteria' });
            }

            if (results.length > 0) {
                // Kriteria dengan nama yang sama sudah ada
                req.flash('postCheckInfo', 'Data kriteria sudah ada');
                return res.redirect('/data/data-kriteria');
            }

            // Jika kriteria belum ada, lanjutkan proses penambahan kriteria
            // Mendapatkan jumlah kriteria yang sudah ada di database
        const countQuery = 'SELECT COUNT(*) AS total FROM kriteria';
        db.query(countQuery, (err, results) => {
            if (err) {
                console.error('Terjadi kesalahan saat menghitung jumlah kriteria:', err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menghitung jumlah kriteria' });
            }

            const count = results[0].total;
            // Membuat kode kriteria baru (misal: C1, C2, dst.)
            const kodeKriteria = 'C' + (count + 1);

            // Menambahkan kode kriteria ke dalam objek kriteriaField
            kriteriaField.kode_kriteria = kodeKriteria;

            const insertQuery = 'INSERT INTO kriteria SET ?';

            // Menjalankan query untuk menambahkan kriteria baru
            db.query(insertQuery, kriteriaField, (err, results) => {
                if (err) {
                    console.error('Terjadi kesalahan saat menambahkan kriteria baru:', err);
                    return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan kriteria baru' });
                }

                req.flash('postInfo', 'Data kriteria berhasil diupload');
                res.redirect('/data/data-kriteria');
            });
        });
    });
};



// exports.postKriteria = (req, res) => {
//     const kriteriaField = {
//         nama_kriteria: req.body.nama_kriteria
//     };

//     // Mendapatkan jumlah kriteria yang sudah ada di database
//     const countQuery = 'SELECT COUNT(*) AS total FROM kriteria';
//     db.query(countQuery, (err, results) => {
//         if (err) {
//             res.status(500);
//         } else {
//             const count = results[0].total;
//             // Membuat kode kriteria baru (misal: C1, C2, dst.)
//             const kodeKriteria = 'C' + (count + 1);

//             // Menambahkan kode kriteria ke dalam objek kriteriaField
//             kriteriaField.kode_kriteria = kodeKriteria;

//             const insertQuery = 'INSERT INTO kriteria SET ?';

//             db.query(insertQuery, kriteriaField, (err, results) => {
//                 if (err) {
//                     res.status(500);
//                 } else {
//                     req.flash('postInfo', 'Data kriteria berhasil di upload');
//                     res.redirect('/data/data-kriteria');
//                 }
//             });
//         }
//     });
// };


// Fungsi untuk mengupdate kode kriteria setelah kriteria dihapus
function updateKodeKriteria() {
    // Query untuk mendapatkan daftar kriteria yang tersisa
    const getRemainingKriteriaQuery = 'SELECT kode_kriteria FROM kriteria';
    db.query(getRemainingKriteriaQuery, (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat mendapatkan daftar kriteria tersisa:', err);
            // Handle error jika terjadi kesalahan
            return;
        }

        // Lakukan pembaruan kode kriteria
        results.forEach((row, index) => {
            const newKodeKriteria = 'C' + (index + 1);

            // Query untuk melakukan pembaruan kode kriteria
            const updateKodeKriteriaQuery = 'UPDATE kriteria SET kode_kriteria = ? WHERE kode_kriteria = ?';
            db.query(updateKodeKriteriaQuery, [newKodeKriteria, row.kode_kriteria], (err, result) => {
                if (err) {
                    console.error('Terjadi kesalahan saat mengupdate kode kriteria:', err);
                    // Handle error jika terjadi kesalahan
                }
            });
        });
    });
}


exports.postDeleteKriteria = (req, res) => {
    const id = req.body.id_kriteria;
    const kodeKriteria = req.body.kode_kriteria;

    // Query untuk menghapus data kriteria berdasarkan ID
    const deleteKriteriaQuery = 'DELETE FROM kriteria WHERE id_kriteria = ?';
    // Query untuk menghapus data rel_alternatif berdasarkan kode_kriteria
    const deleteRelAlternatifQuery = 'DELETE FROM rel_alternatif WHERE kode_kriteria = ?';

    // Menggunakan Promise.all untuk menjalankan kedua query secara paralel
    Promise.all([
        new Promise((resolve, reject) => {
            db.query(deleteKriteriaQuery, [id], (err, deleteKriteriaResults) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(deleteKriteriaResults);
                }
            });
        }),
        new Promise((resolve, reject) => {
            db.query(deleteRelAlternatifQuery, [kodeKriteria], (err, deleteRelAlternatifResults) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(deleteRelAlternatifResults);
                }
            });
        })
    ])
    .then(results => {
        // Jika kedua query berhasil dijalankan
        updateKodeKriteria();
        req.flash('deleteInfo', 'Data kriteria dan rel_alternatif berhasil dihapus!');
        res.redirect('/data/data-kriteria');
    })
    .catch(err => {
        // Jika terjadi kesalahan pada salah satu query
        console.error('Error deleting data:', err);
        req.flash('deleteInfo', 'Gagal menghapus data kriteria dan rel_alternatif');
        res.redirect('/data/data-kriteria');
    });
};


