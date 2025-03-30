const mongoose = require('mongoose');

const studentLoginSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: Number,
        default: 3
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    },
    studentDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddStudent'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const studentaddparentSchema = mongoose.Schema({
    parentid: {
        type: String,
        required: true
    },
    parentname: {
        type: String,
        required: true
    },
    studentid: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true,
    },
    relation: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    aadhaar: {
        type: Number,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    usertype: {
        type: Number,
        default: 4
    },
    loginid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Parentlogin'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

})

const submissionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examination',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddStudent',
        required: true
    },
    answers: {
        type: Map,
        of: String,
        default: null
    },
    answerSheet: {
        type: String,
        default: null
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
});

const studentlogmodel = mongoose.model('StudentLogin', studentLoginSchema);
const addparentmodel = mongoose.model('AddParent', studentaddparentSchema);
const Submission = mongoose.model('Submission', submissionSchema);
module.exports = { studentlogmodel, addparentmodel, Submission }
