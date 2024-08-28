const db = require('../utils/database');
const fs = require('fs');
const ExcelJS = require('exceljs');
const Docxtemplater = require('docxtemplater');


const PDFDocument = require('pdfkit');

// Fungsi untuk mengambil data kriteria dari database
function getKriteriaData(callback) {
    const query = 'SELECT * FROM kriteria'; // Ganti 'kriteria' dengan nama tabel kriteria Anda
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching kriteria data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

// Fungsi untuk mengambil data relasi alternatif dari database
function getRelAlternatifData(callback) {
    const query = `
    SELECT rel.kode_alternatif, karyawan.nama_karyawan, rel.kode_kriteria, rel.nilai
    FROM rel_alternatif rel
    JOIN karyawan ON rel.kode_alternatif = karyawan.kode_alternatif
  `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching rel_alternatif data:', err);
            return callback(err, null);
        }
        callback(null, results);
    });
}

exports.renderRelAlternatif = (req, res) => {
    // Panggil fungsi untuk mengambil data relasi alternatif dari database
    getRelAlternatifData((err, relAlternatifData) => {
        if (err) {
            console.error('Error fetching rel_alternatif data:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        // Buat objek untuk menyimpan data karyawan beserta nilai kriteria
        const karyawanData = {};

        // Iterasi melalui data relasi alternatif
        relAlternatifData.forEach(data => {
            // Jika kode alternatif belum ada di objek karyawanData, tambahkan
            if (!karyawanData[data.kode_alternatif]) {
                karyawanData[data.kode_alternatif] = {
                    kode_alternatif: data.kode_alternatif,
                    nama_karyawan: data.nama_karyawan,
                    nilai: {}
                };
            }

            // Tambahkan nilai kriteria ke objek karyawanData
            karyawanData[data.kode_alternatif].nilai[data.kode_kriteria] = data.nilai;
        });

        // Ubah objek karyawanData menjadi array untuk dikirim ke tampilan
        const karyawanArray = Object.values(karyawanData);

        // Panggil fungsi untuk mengambil data kriteria dari database
        getKriteriaData((err, kriteriaData) => {
            if (err) {
                console.error('Error fetching kriteria data:', err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Jika sukses, kirim data ke tampilan (view) untuk dirender
            res.render('data_rel_alternatif', { karyawanArray, kriteriaData });
        });
    });
};


exports.karyawanPage = (req, res) => {
    const locals = {
        title: "Data Karyawan",
        description: "Data karyawan SPK"
    };

    // Query untuk membaca data karyawan
    const readQuery = 'SELECT * FROM karyawan';
    db.query(readQuery, (err, karyawanResults) => {
        if (err) {
            console.error('Error fetching karyawan data:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Panggil fungsi untuk mengambil data relasi alternatif dari database
        getRelAlternatifData((err, relAlternatifData) => {
            if (err) {
                console.error('Error fetching rel_alternatif data:', err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }

            // Buat objek untuk menyimpan data karyawan beserta nilai kriteria
            const karyawanData = {};

            // Iterasi melalui data relasi alternatif
            relAlternatifData.forEach(data => {
                // Jika kode alternatif belum ada di objek karyawanData, tambahkan
                if (!karyawanData[data.kode_alternatif]) {
                    karyawanData[data.kode_alternatif] = {
                        kode_alternatif: data.kode_alternatif,
                        nama_karyawan: data.nama_karyawan,
                        nilai: {}
                    };
                }

                // Tambahkan nilai kriteria ke objek karyawanData
                karyawanData[data.kode_alternatif].nilai[data.kode_kriteria] = data.nilai;
            });

            // Ubah objek karyawanData menjadi array untuk dikirim ke tampilan
            const karyawanArray = Object.values(karyawanData);

            // Mendapatkan data kriteria
            getKriteriaData((err, kriteriaResults) => {
                if (err) {
                    console.error('Error fetching kriteria data:', err);
                    return res.status(500).send('Internal Server Error');
                }

                const messagePost = req.flash('postInfo');
                const messageDelete = req.flash('deleteInfo');

                res.render('data_karyawan', {
                    locals,
                    karyawanData: karyawanResults,
                    kriteriaData: kriteriaResults,
                    messagePost,
                    messageDelete,
                    relAlternatifData: karyawanArray // Menambahkan data relasi alternatif ke tampilan data karyawan
                });
            });
        });
    });
};


exports.getBobotKosong = (req, res) => {
    // Query untuk membaca data karyawan tanpa nilai bobot
    const queryWithoutBobot = `
        SELECT 
            k.id_karyawan,
            k.kode_alternatif, 
            k.nama_karyawan, 
            k.tanggal_masuk,
            'nilai bobot kosong' AS nilai_bobot 
        FROM 
            karyawan k 
        LEFT JOIN 
            rel_alternatif r ON k.kode_alternatif = r.kode_alternatif 
        WHERE 
            r.kode_alternatif IS NULL
    `;

    // Query untuk membaca data karyawan dengan nilai bobot
    const queryWithBobot = `
        SELECT 
            k.id_karyawan,
            k.kode_alternatif, 
            k.nama_karyawan, 
            k.tanggal_masuk,
            r.nilai AS nilai_bobot 
        FROM 
            karyawan k 
        JOIN 
            rel_alternatif r ON k.kode_alternatif = r.kode_alternatif
    `;

    // Menggabungkan hasil kedua query menggunakan UNION ALL
    const unionQuery = `(${queryWithoutBobot}) UNION ALL (${queryWithBobot})`;

    // Menggunakan DISTINCT untuk memastikan setiap baris hanya muncul sekali
    const finalQuery = `SELECT * FROM (${unionQuery}) AS combinedResults GROUP BY kode_alternatif, nama_karyawan`;

    db.query(finalQuery, (err, karyawanResults) => {
        if (err) {
            console.error('Error fetching karyawan data:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Objek untuk menyimpan data yang akan dikirim ke tampilan
        const locals = {
            title: "Data Karyawan",
            description: "Data karyawan SPK",
            karyawanData: karyawanResults
        };

        // Render halaman data_karyawan dengan menggunakan view engine EJS
        res.render('data_bobot_kosong', locals);
    });
};




exports.editBobot = (req,res)=>{
    
}

//untuk tambah bobot alternatif / karyawan
exports.tambahBobot = (req, res) => {
    const { kode_alternatif, nilai, kode_kriteria } = req.body;

    // Query SQL untuk mengambil data kriteria dari tabel kriteria
    const sqlKriteria = 'SELECT * FROM kriteria';
    db.query(sqlKriteria, (err, kriteriaResults) => {
        if (err) {
            console.error('Error saat mengambil data kriteria:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        // Jumlah data kriteria
        const jumlahKriteria = kriteriaResults.length;

        // Menggunakan looping untuk meng-handle input data yang di-looping
        for (let i = 0; i < jumlahKriteria; i++) {
            const kodeAlternatif = kode_alternatif[i];
            const nilaiKaryawan = nilai[i];
            const kodeKriteria = kode_kriteria[i];

            // Query SQL untuk menambahkan data baru ke tabel rel_alternatif
            const sql = `INSERT INTO rel_alternatif (kode_alternatif, nilai, kode_kriteria) VALUES (?, ?, ?)`;
            db.query(sql, [kodeAlternatif, nilaiKaryawan, kodeKriteria], (err, results) => {
                if (err) {
                    console.error('Error saat menambahkan data:', err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
        
                console.log('Data berhasil ditambahkan');
                console.log(results);
            });
        }

        res.status(200).json({ message: 'Data berhasil ditambahkan' });
    });
};


exports.addKaryawanPage = (req,res)=>{
    const locals = {
        title : "Tambah Karyawan", 
        description : "Tambah data karyawan SPK"
    }
    const messageCheck = req.flash('postCheckInfo')
    res.render('add_karyawan',{
        locals,
        messageCheck
    })
}


exports.postKaryawanData = (req, res) => {
    const karyawanFields = {
        nama_karyawan: req.body.nama_karyawan,
        tanggal_masuk: req.body.tanggal_masuk,
        alamat: req.body.alamat,
        nomor_telepon: req.body.nomor_telepon,
        email: req.body.email
    };

    // Mendapatkan jumlah karyawan yang sudah ada di database
    const countQuery = 'SELECT COUNT(*) AS total FROM karyawan';
    db.query(countQuery, (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat menghitung jumlah karyawan:', err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat menghitung jumlah karyawan' });
        }

        const count = results[0].total;
        // Membuat kode karyawan baru (misal: A1, A2, dst.)
        const kodeKaryawan = 'A' + (count + 1);

        // Menambahkan kode karyawan ke dalam objek karyawanFields
        karyawanFields.kode_alternatif = kodeKaryawan;

        const insertQuery = 'INSERT INTO karyawan SET ?';

        // Menjalankan query untuk menambahkan karyawan baru
        db.query(insertQuery, karyawanFields, (err, results) => {
            if (err) {
                console.error('Terjadi kesalahan saat menambahkan karyawan baru:', err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan karyawan baru' });
            }

            req.flash('postInfo', 'Data karyawan berhasil diupload');
            res.redirect('/data/NhgdjgfNVGzvczYDF/form-pengisian-karyawan');
        });
    });
};

exports.postKaryawanDataAdm = (req, res) => {
    const karyawanFields = {
        nama_karyawan: req.body.nama_karyawan,
        tanggal_masuk: req.body.tanggal_masuk,
        alamat: req.body.alamat,
        nomor_telepon: req.body.nomor_telepon,
        email: req.body.email,
        status: req.body.status
    };

    // Query untuk memeriksa apakah karyawan dengan nama yang sama sudah ada
    const checkQuery = 'SELECT * FROM karyawan WHERE nama_karyawan = ?';
    db.query(checkQuery, [karyawanFields.nama_karyawan], (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat memeriksa karyawan:', err);
            return res.status(500).json({ message: 'Terjadi kesalahan saat memeriksa karyawan' });
        }

        if (results.length > 0) {
            // Karyawan dengan nama yang sama sudah ada
            req.flash('postCheckInfo', 'Data karyawan sudah ada');
            return res.redirect('/data/tambah-karyawan');
        }

        // Jika karyawan belum ada, lanjutkan proses penambahan karyawan
        // Mendapatkan jumlah karyawan yang sudah ada di database
        const countQuery = 'SELECT COUNT(*) AS total FROM karyawan';
        db.query(countQuery, (err, results) => {
            if (err) {
                console.error('Terjadi kesalahan saat menghitung jumlah karyawan:', err);
                return res.status(500).json({ message: 'Terjadi kesalahan saat menghitung jumlah karyawan' });
            }

            const count = results[0].total;
            // Membuat kode karyawan baru (misal: A1, A2, dst.)
            const kodeKaryawan = 'A' + (count + 1);

            // Menambahkan kode karyawan ke dalam objek karyawanFields
            karyawanFields.kode_alternatif = kodeKaryawan;

            const insertQuery = 'INSERT INTO karyawan SET ?';

            // Menjalankan query untuk menambahkan karyawan baru
            db.query(insertQuery, karyawanFields, (err, results) => {
                if (err) {
                    console.error('Terjadi kesalahan saat menambahkan karyawan baru:', err);
                    return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan karyawan baru' });
                }

                req.flash('postInfo', 'Data karyawan berhasil diupload');
                res.redirect('/data/data-karyawan');
            });
        });
    });
};


exports.getKaryawanById = (req,res)=>{
    try {
        const id = req.params.id;
        const queryID = 'SELECT * FROM karyawan WHERE id_karyawan = ?'

        db.query(queryID,[id],(err,results)=>{
          if (err) {
            // Tangani kesalahan jika terjadi
            console.error('Error fetching karyawan:', err);
            res.status(500).send('Error fetching karyawan');
          } else {
            res.render('edit_karyawan',{
                karyawanData : results[0]
            })
          }  
        })
    } catch (error) {
        
    }
}



// Fungsi untuk mengambil data dari database
exports.getDataFromDatabase = (req, res) => {
    // Contoh pengambilan data dari database
    db.query('SELECT * FROM karyawan', (err, result) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Panggil fungsi untuk membuat PDF setelah data diterima
        createPDF(result, res);
    });
};

// Fungsi untuk membuat dokumen PDF
function createPDF(data, res) {
    // const PDFDocument = require('pdfkit');
    // const fs = require('fs');

    const doc = new PDFDocument({ size: 'letter', layout: 'landscape' }); // Mengatur layout ke landscape

    // Mengatur respon header untuk PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');

    // Mulai menulis ke dokumen PDF
    doc.pipe(res);

    // Menambahkan judul
    doc.font('Helvetica-Bold').fontSize(20).text('Data Karyawan', { align: 'center' });
    doc.moveDown();

    // Membuat header tabel
    doc.font('Helvetica-Bold').fontSize(12);
    const header = ['No', 'Nama Karyawan', 'Alamat'];
    const tableRowHeight = 30;
    const col1Width = 50;
    const col2Width = 200;
    const col3Width = 300;
    let y = doc.y;
    doc.text(header[0], 100, y);
    doc.text(header[1], 100 + col1Width, y);
    doc.text(header[2], 100 + col1Width + col2Width, y);

    // Mengatur posisi vertikal untuk data
    y += 20;

    // Menuliskan data ke dalam tabel
    doc.font('Helvetica').fontSize(12);
    data.forEach((row, index) => {
        const xPos = 100;
        const yPos = y + (index * tableRowHeight);
        doc.text((index + 1).toString(), xPos, yPos);
        doc.text(row.nama_karyawan, xPos + col1Width, yPos);
        doc.text(row.alamat, xPos + col1Width + col2Width, yPos);
    });

    // Selesai menulis ke dokumen PDF
    doc.end();
}



// Fungsi untuk mengambil data dari database dan mengonversinya ke Excel
exports.convertToExcel = (req, res) => {
    // Contoh pengambilan data dari database
    db.query('SELECT * FROM karyawan', (err, result) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Panggil fungsi untuk membuat Excel setelah data diterima
        createExcel(result, res);
    });
};

// Fungsi untuk membuat file Excel
function createExcel(data, res) {
    // Membuat workbook baru
    const workbook = new ExcelJS.Workbook();

    // Membuat worksheet baru
    const worksheet = workbook.addWorksheet('Data Karyawan');

    // Menambahkan header
    worksheet.addRow(['No', 'Nama Karyawan', 'Alamat']);

    // Menambahkan data
    data.forEach((row, index) => {
        worksheet.addRow([index + 1, row.nama_karyawan, row.alamat]);
    });

    // Mengatur respon header untuk Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="output.xlsx"');

    // Mengirimkan workbook sebagai respons
    workbook.xlsx.write(res)
        .then(function () {
            res.end();
        });
}

// Fungsi untuk mengambil data dari database dan mengonversinya ke format docx
exports.convertToDocx = (req, res) => {
    // Contoh pengambilan data dari database
    db.query('SELECT * FROM karyawan', (err, result) => {
        if (err) {
            console.error('Error retrieving data from database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Panggil fungsi untuk membuat dokumen Word setelah data diterima
        createDocx(result, res);
    });
};

// Fungsi untuk membuat dokumen Word
function createDocx(data, res) {
    const doc = new Docxtemplater();

    // Template dokumen
    const templateContent = fs.readFileSync('views/template.docx', 'binary');
    doc.loadZip(new JSZip(templateContent));

    // Ganti variabel dalam template dengan data
    doc.setData({
        karyawan: data.map((employee, index) => ({
            no: index + 1,
            nama_karyawan: employee.nama_karyawan,
            alamat: employee.alamat
        }))
    });

    try {
        doc.render();
    } catch (error) {
        console.error('Error rendering document:', error);
        res.status(500).send('Internal Server Error');
        return;
    }

    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // Mengatur respon header untuk dokumen Word
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="output.docx"');

    // Mengirimkan dokumen sebagai respons
    res.send(buffer);
}




exports.postDeleteKaryawan = (req, res) => {
    const id = req.body.id_karyawan;

    const deleteQuery = 'DELETE FROM karyawan WHERE id_karyawan = ?';

    // Pastikan id diubah menjadi array sebelum dikirim ke db.query
    db.query(deleteQuery, [id], (err, deleteResults) => {
        if (err) {
            res.send(err)
            // req.flash('deleteInfo', 'Gagal menghapus data kriteria');
            // console.error('Error deleting data:', err);
            // res.redirect('/data/data-kriteria');
        } else {
            updateKodeAlternatif();
            req.flash('deleteInfo', 'Data Karyawan berhasil dihapus!');
            res.redirect('/data/data-karyawan');
        }
    });
};

function updateKodeAlternatif(){
    // Query untuk mendapatkan daftar karyawan yang tersisa
    const getRemainingKaryawanQuery = 'SELECT kode_alternatif FROM karyawan';
    db.query(getRemainingKaryawanQuery, (err, results) => {
        if (err) {
            console.error('Terjadi kesalahan saat mendapatkan daftar kriteria tersisa:', err);
            // Handle error jika terjadi kesalahan
            return;
        }

        // Lakukan pembaruan kode kriteria
        results.forEach((row, index) => {
            const newKodeAlternatif = 'A' + (index + 1);

            // Query untuk melakukan pembaruan kode kriteria
            const updateKodeKaryawanQuery = 'UPDATE karyawan SET kode_alternatif = ? WHERE kode_alternatif = ?';
            db.query(updateKodeKaryawanQuery, [newKodeAlternatif, row.kode_alternatif], (err, result) => {
                if (err) {
                    console.error('Terjadi kesalahan saat mengupdate kode alternatif:', err);
                    // Handle error jika terjadi kesalahan
                }
            });
        });
    });
}



exports.ubahBobotAlternatif = (req,res)=>{
    try {
        const id = req.params.id;


        const getAlternatif = 'SELECT * FROM karyawan WHERE id_karyawan = ?'

        db.query(getAlternatif,[id],(err,results)=>{
          if (err) {
            // Tangani kesalahan jika terjadi
            console.error('Error fetching karyawan:', err);
            res.status(500).send('Error fetching karyawan');
          } else {

            getKriteriaData((err,kriteriaResults)=>{
                if (err) {
                    console.error('Error fetching kriteria data:', err);
                    return res.status(500).send('Internal Server Error');
                }

                res.render('tambah_nilai_bobot',{
                    karyawanData : results[0],
                    kriteriaData : kriteriaResults
                })
            })
          }  
        })
    } catch (error) {
        
    }

}


