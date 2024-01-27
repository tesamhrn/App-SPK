exports.karyawanViewPage = (req,res)=>{
    const locals = {
        title : "Data Karyawan",
        description : "Data karyawan SPK"
    }
    res.render('data_karyawan',{
        locals
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