const db = require("../utils/database");

exports.dashboardPage = (req,res)=>{
    const locals = {
        title : "Dashboard Page",
        description : "Dashboard SPK website"
    }
    res.render('dashboard',{
        locals
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
        title: "Dashboard Page",
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

