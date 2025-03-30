const mongoose = require('mongoose');

const teacherloginSchema = mongoose.Schema({
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
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
    teacherDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddTeacher'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const teachernotificationSchema = mongoose.Schema({
    teacherid: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const courseMaterialSchema = mongoose.Schema({
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeacherLogin',
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
    semester: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddStudent',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddTeacher',
        required: true
    }
}, { timestamps: true });

const examSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true
    },
    mode: {
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
    semester: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    dateOfExamination: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    maximumMark: {
        type: Number,
        required: true
    },
    passMark: {
        type: Number,
        required: true
    },
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String,
        }
    ],
    questionFile: {
        type: String
    }
}, { timestamps: true });

const teacherlogmodel = mongoose.model('Teacherlogin', teacherloginSchema);
const teachernotificationmodel = mongoose.model('TeacherNotification', teachernotificationSchema);
const CourseMaterial = mongoose.model('CourseMaterial', courseMaterialSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Exam = mongoose.model('Examination', examSchema);

module.exports = { teacherlogmodel, teachernotificationmodel, CourseMaterial, Attendance, Exam };