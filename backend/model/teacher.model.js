const mongoose = require('mongoose');

const teacherloginSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    usertype:{
        type: Number,
        default: 3
    },
    resetToken:{
        type: String,
    },
    resetTokenExpiry: { 
        type: Date,
    },
    teacherDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddTeacher'
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

const teacherlogmodel = mongoose.model('Teacherlogin', teacherloginSchema);
module.exports= {teacherlogmodel};