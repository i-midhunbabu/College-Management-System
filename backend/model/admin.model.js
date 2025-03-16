const mongoose = require('mongoose');

//Admin Registration Scheme
const adminregScheme = mongoose.Schema({
    adminname:{
        type: String,
        required: true
    },
    loginid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminLogin'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})


// Admin Login Schema
const adminloginScheme = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    adminname:{
        type: String,
        required: true
    },
    usertype:{
        type: Number
    },
    resetToken: { 
        type: String,
    },
    resetTokenExpiry: { 
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const adminaddteacherSchema = mongoose.Schema({
    teacherid:{
        type: String,
        required: true
    },
    teachername:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    dateofbirth:{
        type: String,
        required: true
    },
    qualification:{
        type: [String],
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    salary:{
        type: Number,
        required: true
    },
    usertype:{
        type: Number
    },
    loginid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherLogin'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const adminAddStudentSchema = mongoose.Schema({
    studentid:{
        type: String,
        required: true
    },
    studentname:{
        type: String,
        required: true
    },
    dateofbirth:{
        type: String,
        required: true
    },
    guardianname:{
        type: String,
        required: true
    },
    guardianrelation:{
        type: String,
        required: true
    },
    bloodgroup:{
        type: String,
        required: true
    },
    tenth:{
        type: Number,
        required: true
    },
    twelve:{
        type: Number,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    usertype:{
        type: Number
    },
    loginid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentLogin'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})



const adminregmodel = mongoose.model('AdminReg', adminregScheme);
const adminloginmodel = mongoose.model('AdminLogin',adminloginScheme);
const adminaddteachermodel = mongoose.model('AdminAddTeacher', adminaddteacherSchema)
const adminaddstudentmodel = mongoose.model('AdminAddStudent', adminAddStudentSchema)
module.exports= {adminregmodel, adminloginmodel, adminaddteachermodel, adminaddstudentmodel}