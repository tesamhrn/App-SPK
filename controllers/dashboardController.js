const db = require("../utils/database");

const { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } = require('firebase/storage')
const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth");

const { auth  } = require('../config/firebaseConfig');
const storageFB = getStorage();



// Fungsi untuk mengunggah file ke Firebase Storage dan menyimpan data teks ke MySQL
async function uploadImage(file, fileName) {
    try {
        // Sign in ke Firebase jika belum
        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        // Mengunggah file ke Firebase Storage
        const storageRef = ref(storageFB, fileName);
        const metadata = {
            contentType: file.type,
        };
        await uploadBytesResumable(storageRef, file.buffer, metadata);

        // Mengembalikan nama file untuk digunakan dalam menyimpan data di MySQL
        return fileName;
    } catch (error) {
        console.error(error); // Mencetak kesalahan ke konsol
        throw error;
    }
}

exports.uploadProfile = async (req, res) => {
    // console.log(req.body);
    const file = {
        type: req.file.mimetype,
        buffer: req.file.buffer,
    };

    // Cek jika ada file yang diunggah
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    // Buat nama file menggunakan timestamp untuk memastikan keunikan
    const dateTime = Date.now();
    const fileName = `images/${dateTime}`;

    try {
        // Mengunggah foto ke Firebase Storage dan mendapatkan nama file
        const uploadedFileName = await uploadImage(file, fileName);

        // Simpan nama file foto ke dalam database MySQL
        const sql = 'INSERT INTO test_admin (test_admin) VALUES (?)';
        const values = [uploadedFileName];
        db.query(sql, values, function (err, result) {
            if (err) {
                console.error('Error executing MySQL query: ' + err.stack);
                return res.status(500).send('Internal Server Error');
            }
            console.log('New record inserted with ID: ' + result.insertId);
            // res.redirect('/mdERQU0pnVpHd08ifQ/adm/data_book'); // Redirect setelah penyimpanan berhasil
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



exports.dashboardPage = async(req,res)=>{
    const locals = {
        title : "Dashboard Page",
        description : "Dashboard SPK website"
    }

    const messageLoginInfo = await req.flash('infoLogin')

    res.render('dashboard',{
        locals,
        messageLoginInfo
    });
}


// exports.perhitunganPage = (req,res)=>{
//     const locals = {
//         title : "Dashboard Page",
//         description : "Dashboard SPK website"
//     }
//     const readQuery = 'SELECT * FROM kriteria'; 

//     db.query(readQuery, (err,resultsRead)=>{
//         res.render('perhitungan',{
//             locals,
//             kriteriaData: resultsRead,
//         });
//     })
// }

exports.perhitunganPage = async (req, res) => {
    const locals = {
        title: "Perhitungan AHP-TOPSIS",
        description: "Dashboard SPK website"
    };

    const readKriteriaQuery = 'SELECT * FROM kriteria';
    const readKaryawanQuery = 'SELECT * FROM karyawan';

    try {
        // Menjalankan kedua query secara bersamaan menggunakan async/await
        const [resultsReadKriteria, resultsReadKaryawan] = await Promise.all([
            queryPromise(readKriteriaQuery),
            queryPromise(readKaryawanQuery)
        ]);

        // Mengirimkan hasil ke template render
        res.render('perhitungan', {
            locals,
            kriteriaData: resultsReadKriteria,
            karyawanData: resultsReadKaryawan
        });
    } catch (error) {
        // Menangani kesalahan jika terjadi
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }   
};

// Fungsi untuk menjalankan query dan mengembalikan promise
function queryPromise(query) {
    return new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

exports.totalKaryawanJSON = (req, res) => {
    try {

        // Mengambil total buku dari database MySQL
        db.query('SELECT COUNT(*) AS total FROM karyawan', (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const totalKaryawan = results[0].total;


            res.json(totalKaryawan);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.totalKriteriaJSON = (req, res) => {
    try {

        // Mengambil total buku dari database MySQL
        db.query('SELECT COUNT(*) AS total FROM kriteria', (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            const totalKriteria = results[0].total;


            res.json(totalKriteria);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.profilePage = (req,res)=>{
    res.render('my_profile')
}