exports.karyawanViewPage = (req,res)=>{
    const locals = {
        title : "Penilaian Karyawan",
        description : "Nilai karyawan SPK"
    }
    res.render('data_penilaian',{
        locals
    })
}