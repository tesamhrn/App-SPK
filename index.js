require('dotenv').config();
const path = require ('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session')

const express = require('express');
const loginRouter = require('./router/login');
const PORT = process.env.PORT



const app = express();


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

])


app.set('view engine', 'ejs');

app.use('/', loginRouter);



app.listen(PORT,()=>{
    console.log(`server started at http://localhost:${PORT}`);
});

