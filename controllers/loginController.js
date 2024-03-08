//Get View
// Import modul-modul yang diperlukan
const bcrypt = require('bcrypt');
// const db = require('../utils/database')

const db = require('../utils/database');

exports.loginPage = async (req, res) => {
    try {
        const locals = {
            title: "Login Page",
            description: "Login Page IS Selling"
        };

        // Ambil pesan flash
        const infoMessage = req.flash('info');
        const errorMessage = req.flash('errorLogin'); // Ubah sesuai dengan nama pesan flash yang Anda gunakan

        const infoCreate = req.flash('infoCreate')

        res.render('login', {
            locals,
            infoMessage,
            errorMessage,
            infoCreate
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat memuat halaman login:', error);
        // Tambahkan respons error jika diperlukan
    }
};




exports.postLogin = (req, res) => {
    const { username, password } = req.body;

    try {
        // Membuat koneksi ke database
        // const connection = db();

        // Ambil data pengguna dari database berdasarkan username
        db.query(
            'SELECT * FROM admin WHERE username = ?',
            [username],
            function (error, results, fields) {
                if (error) {
                    console.error('Terjadi kesalahan saat mengambil data pengguna:', error);
                    return res.status(500).json({ message: 'Terjadi kesalahan saat proses login' });
                }

                // Pastikan pengguna ditemukan dalam database
                if (results.length === 0) {
                    // Set flash message untuk informasi login gagal
                    req.flash('errorLogin', 'Username atau password salah.');
                    return res.redirect('/');
                    // return res.status(401).json({ message: 'Username atau password salah' });
                }

                // Bandingkan password yang dimasukkan dengan password yang di-hash dalam database
                bcrypt.compare(password, results[0].password, function(err, match) {
                    if (err) {
                        console.error('Terjadi kesalahan saat membandingkan password:', err);
                        return res.status(500).json({ message: 'Terjadi kesalahan saat proses login' });
                    }

                    if (!match) {
                        // Set flash message untuk informasi login gagal
                        req.flash('errorLogin', 'Username atau password salah.');
                        return res.redirect('/'); //kembali ke login.
                        // return res.status(401).json({ message: 'Username atau password salah' });
                    }

                    // Set flash message untuk informasi login
                    req.flash('infoLogin', 'Login Berhasil');

                    // Jika autentikasi berhasil, redirect ke halaman dashboard
                    return res.redirect('/dashboard');
                });
            }
        );
    } catch (error) {
        console.error('Terjadi kesalahan saat proses login:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat proses login' });
    }
};


exports.postCreateAccount = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Membuat koneksi ke database
        // const connection = db();

        // Hash password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Query untuk menyimpan informasi akun ke database
        const query = 'INSERT INTO admin (username, password) VALUES (?, ?)';
        const values = [username, hashedPassword];

        db.query(query, values, (error, results, fields) => {


            if (error) {
                console.error('Terjadi kesalahan saat membuat akun:', error);
                return res.status(500).json({ message: 'Terjadi kesalahan saat membuat akun' });
            }

            // Set flash message untuk informasi pembuatan akun
            req.flash('infoCreate', 'Akun berhasil dibuat');

            // Kirim respons berhasil ke client
            res.redirect('/')
            // res.status(200).json({ message: 'Akun berhasil dibuat' });
        });
    } catch (error) {
        // Tangani error
        console.error('Terjadi kesalahan saat membuat akun:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat membuat akun' });
    }
};