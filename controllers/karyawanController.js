const db = require('../utils/database');

exports.karyawanViewPage = (req,res)=>{
    const locals = {
        title : "Data Karyawan",
        description : "Data karyawan SPK"
    }

    const readQuery = 'SELECT * FROM karyawan';
    db.query(readQuery,(err,resultsRead)=>{

        if(err){
            throw err;
        }

        else if(!err){
            res.render('data_karyawan',{
                locals,
                karyawanData:resultsRead
            })        
        }
    })
}

exports.addKaryawanPage = (req,res)=>{
    const locals = {
        title : "Tambah Karyawan", 
        description : "Tambah data karyawan SPK"
    }

    res.render('add_karyawan',{
        locals
    })
}

exports.postKaryawanData = (req,res) =>{
    try {
        // Ambil data dari body permintaan
        const karyawanFields = {
            nama_lengkap:req.body.nama_lengkap, 
            tanggal_masuk: req.body.tanggal_masuk, 
            alamat: req.body.alamat, 
            nomor_telepon: req.body.nomor_telepon, 
            email: req.body.email
        }

        // Lakukan validasi data
        // if (!nama_lengkap || !tanggal_masuk || !alamat || !nomor_telepon || !email) {
        //     return res.status(400).json({ success: false, message: 'Semua field harus diisi' });
        // }

        const insertQuery = 'INSERT INTO karyawan SET ?'

        db.query(insertQuery, karyawanFields,(err,resultsInsert)=>{

            if(err){
                throw err;
            }

            else if(!err){
                req.flash('postInfo', 'Selamat, data anda berhasil di upload');
                res.redirect('/data/NhgdjgfNVGzvczYDF/form-pengisian-karyawan');
            }
        });

        // Lakukan operasi tambah karyawan di sini

        // Berikan respons jika berhasil
        // res.status(201).json({ success: true, message: 'Karyawan berhasil ditambahkan' });
    } catch (error) {
        // Tangani kesalahan yang terjadi
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan internal', error });
    }
}