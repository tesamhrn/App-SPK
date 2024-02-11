exports.kriteriaPage = (req,res)=>{

    const locals = {
        title : "Data Kriteria",
        description : "data kriteria SPK AHP & TOPSIS"
    }
    res.render('data_kriteria',{
        locals
    })
}



exports.postKriteria = (req,res)=>{
    
}