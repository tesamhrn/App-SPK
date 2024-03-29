const db = require('../utils/database');

exports.kriteriaPage = (req,res)=>{

    const locals = {
        title : "Data Kriteria",
        description : "data kriteria SPK AHP & TOPSIS"
    }
    const readQuery = 'SELECT * FROM kriteria'; 

    db.query(readQuery, (err,resultsRead)=>{
        if(err){
            res.status(500);
        }

        else if(!err){
            
            const messagePost = req.flash('postInfo')
            const messageDelete = req.flash('deleteInfo')
            const messageCheck = req.flash('postCheckInfo')
            

            res.render('data_kriteria',{
                locals,
                messagePost,
                messageDelete,
                messageCheck,
                kriteriaData: resultsRead,
            })
        }
    })

}


exports.editKriteria = (req,res)=>{
    
    const queryEdit = "SELECT * FROM kriteria WHERE id_kriteria = ?"
}



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


exports.postDeleteKriteria = (req, res) => {
    const id = req.body.id_kriteria;

    const deleteQuery = 'DELETE FROM kriteria WHERE id_kriteria = ?';

    // Pastikan id diubah menjadi array sebelum dikirim ke db.query
    db.query(deleteQuery, [id], (err, deleteResults) => {
        if (err) {
            res.send(err,deleteResults)
            // console.error('Error deleting data:', err);
            // req.flash('deleteInfo', 'Gagal menghapus data kriteria');
            // res.redirect('/data/data-kriteria');
        } else {
            req.flash('deleteInfo', 'Data kriteria berhasil dihapus!');
            res.redirect('/data/data-kriteria');
        }
    });
};
