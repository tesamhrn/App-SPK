const mysql = require('mysql2');

const db = mysql.createConnection({
    host:process.env.DB_HOST, // local pc only.
    user: process.env.DB_USER, //local pc .
    password:process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect(function(err,results){

    if(err){
        console.log(`error connecting ${err.message}`);
        
    }
    else if(!err){
        // console.log(results);
        console.log('connection database work :)');
    }
});

module.exports=db;