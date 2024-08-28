require('dotenv').config();
const path = require ('path');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Menetapkan batas maksimum pendengar acara (event listeners) secara global
// require('events').EventEmitter.defaultMaxListeners = 15; // Sesuaikan angka maksimum sesuai kebutuhan Anda


const express = require('express');

const loginRouter = require('./router/login');
const dashboardRouter = require('./router/dashboard');
const karyawanRouter = require('./router/karyawan');
const kriteriaRouter = require('./router/kriteria');
const perhitunganRouter = require('./router/perhitungan');

const database = require('./utils/database');
const PORT = process.env.PORT



const app = express();



database.connect();

// Middleware untuk mengatur sesi dan cookie
app.use(cookieParser());

// Menambahkan middleware body-parser pada aplikasi
app.use(bodyparser.json());
// parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      }
    })
);


app.use(express.static(__dirname + "/public"));



// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.set("views",[
    path.join(__dirname, "/views"),
    path.join(__dirname, "/views/karyawan"),
    path.join(__dirname, "/views/perhitungan"),
    path.join(__dirname, "/views/kriteria"),

])


app.set('view engine', 'ejs');

app.use('/', loginRouter, dashboardRouter, perhitunganRouter);
app.use('/data', karyawanRouter, kriteriaRouter);



app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
});

