//Get View
// Import modul-modul yang diperlukan
const bcrypt = require('bcrypt');
const db = require('../utils/database')

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


exports.postCreateAccount = async (req,res)=>{
    
    
}