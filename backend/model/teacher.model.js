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
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddStudent',
        required: true
    },
    date: {
        type: String,
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
    },
    degree: {
        type: String, // Add degree field
        required: true
    },
    department: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    }
}, { timestamps: true });

const examSchema = new mongoose.Schema({
    examType: {
        type: String,
        required: true,
        enum: ['internal', 'semester']
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
        type: String,
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
    },
    approvalStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
        required: function () {
            return this.examType === 'semester';
        }
    },
    remarks: {
        type: String,
        default: null,
        required: function () {
            return this.examType === 'semester' && this.approvalStatus === 'Rejected';
        }
    },
    teacherid: {
        type: String,
        ref: 'AdminAddTeacher',
        required: function () {
            return this.examType === 'semester';
        }
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminAddTeacher',
        required: true,
        // required: function () {
        //     return this.examType === 'semester';
        // }
    },
    teachername: {
        type: String,
        required: true

        // required: function () {
        //     return this.examType === 'semester';
        // }
    }

}, { timestamps: true });


const markSchema = new mongoose.Schema({
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
    studentid: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    mark: {
        type: Number,
        required: true
    },
    isPass: {
        type: Boolean,
        required: true
    },
    gradedAt: {
        type: Date,
        default: Date.now
    }
});

const teacherlogmodel = mongoose.model('Teacherlogin', teacherloginSchema);
const teachernotificationmodel = mongoose.model('TeacherNotification', teachernotificationSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Exam = mongoose.model('Examination', examSchema);
const Mark = mongoose.model('Mark', markSchema);

module.exports = { teacherlogmodel, teachernotificationmodel, Attendance, Exam, Mark };