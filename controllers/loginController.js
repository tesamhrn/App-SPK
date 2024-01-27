//Get View


exports.loginPage = async(req,res)=>{

    const locals = {
        title : "Login Page",
        description : "Login Page IS Selling"
    }

    const message = await req.flash('info');
    

    res.render('login',{
        locals,
        message
    });

}