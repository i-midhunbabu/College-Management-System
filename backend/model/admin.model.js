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
    degree: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    tenth:{
        type: Number,
        required: true
    },
    twelve:{
        type: Number,
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

const departmentSchema = mongoose.Schema({
    degree: {
        type: String,
        required: true
    },
    department: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const assignedTeacherSchema = mongoose.Schema({
    teacherid: {
        type: String,
        required: true,
    },
    teachername: {
        type: String,
        required: true,
    },
    assignedclass: {
        type: [String],
        required: true,
    },
    subject : {
        type: [String],
        required: true,
    },
    department: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const semesterSchema = mongoose.Schema({
    degree: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    semesters: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const subjectSchema = mongoose.Schema({
    degree: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});


const adminregmodel = mongoose.model('AdminReg', adminregScheme);
const adminloginmodel = mongoose.model('AdminLogin',adminloginScheme);
const adminaddteachermodel = mongoose.model('AdminAddTeacher', adminaddteacherSchema)
const adminaddstudentmodel = mongoose.model('AdminAddStudent', adminAddStudentSchema)
const departmentmodel = mongoose.model('Department', departmentSchema)
const assignedteachermodel = mongoose.model('AssignedTeacher', assignedTeacherSchema);
const semestermodel = mongoose.model('Semester', semesterSchema);
const subjectmodel = mongoose.model('Subject', subjectSchema);
module.exports= {adminregmodel, adminloginmodel, adminaddteachermodel, adminaddstudentmodel, departmentmodel, assignedteachermodel, semestermodel, subjectmodel}