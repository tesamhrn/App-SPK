exports.dashboardPage = (req,res)=>{
    const locals = {
        title : "Dashboard Page",
        description : "Dashboard SPK website"
    }
    res.render('dashboard',{
        locals
    });
}