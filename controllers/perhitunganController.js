const db = require("../utils/database")

exports.karyawanViewPage = (req,res)=>{
    const locals = {
        title : "Penilaian Karyawan",
        description : "Nilai karyawan SPK"
    }
    res.render('data_penilaian',{
        locals
    })
}



// Perbandingan Kriteria Page
exports.PerbandinganKriteriaPage = (req,res)=>{
    const locals = {
        title : "Perbandingan Kriteria",
        description : "Nilai karyawan SPK"
    }

    const readQuery = 'SELECT * FROM kriteria'; 

    db.query(readQuery, (err,resultsRead)=>{
        res.render('perbandingan_kriteria',{
            locals
        })
    })
}