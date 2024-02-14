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