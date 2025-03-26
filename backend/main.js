const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require ('cors');
const database = require('./config/database');
const fileupload = require('express-fileupload');
var path= require('path');
var session= require('express-session');
const nodemailer = require ('nodemailer');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
database();
app.use(fileupload());
app.use(express.static("public"));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))

// app.get('/sample',(req,res)=>{
//     console.log("Sample Text");
// })


var adminRouter = require('./router/admin.router');
app.use('/adminrouter', adminRouter)
var teacherRouter = require('./router/teacher.router');
app.use('/teacherrouter', teacherRouter);
var studentRouter = require ('./router/student.router');
app.use('/studentrouter', studentRouter);
var parentRouter = require ('./router/parent.router');
app.use('/parentrouter', parentRouter);


app.listen(8000);
