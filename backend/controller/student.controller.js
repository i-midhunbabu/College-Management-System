const mongoose = require('mongoose');
const { studentlogmodel, addparentmodel, Submission } = require('../model/student.model');
const { adminaddstudentmodel, subjectmodel } = require('../model/admin.model');
const { parentlogmodel } = require('../model/parent.model');
const { Attendance, Exam, Mark } = require('../model/teacher.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

exports.studentLoginView = async (req, res) => {
    try {
        const studentLoginParams = {
            email: req.body.email,
            password: req.body.password
        };

        const student = await studentlogmodel.findOne({ email: studentLoginParams.email });

        if (student) {
            if (student.password === studentLoginParams.password) {
                if (student.usertype === 3) {
                    // Get student details
                    const studentDetails = await adminaddstudentmodel.findOne({ loginid: student._id });

                    if (studentDetails) {
                        req.session.data = student;
                        res.json({ ...student._doc, studentDetails: studentDetails }); // Send student details
                    } else {
                        res.status(404).json({ message: "Student details not found" });
                    }
                } else {
                    res.status(403).json({ message: "Invalid usertype" });
                }
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (err) {
        console.error("Error in student login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.studentForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const student = await studentlogmodel.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "Email not registered" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        student.resetToken = resetToken;
        student.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await student.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'midhunbabu0474@gmail.com',
                pass: 'haea jsez acef pmke'
            }
        });

        const mailOptions = {
            from: 'midhunbabu@gmail.com',
            to: student.email,
            subject: 'Student Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/studentresetpassword?token=${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        // console.log('Reset token created:', resetToken);

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send password reset email" });
    }
}

exports.studentResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const student = await studentlogmodel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!student) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash new password
        student.password = password;
        student.resetToken = undefined; // Remove the token: After updating password, remove token
        student.resetTokenExpiry = undefined;
        await student.save();

        // Update password in adminaddstudent collection
        const studentDetails = await adminaddstudentmodel.findOne({
            loginid: student._id
        });
        if (studentDetails) {
            studentDetails.password = password;
            await studentDetails.save();
        }

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.studentUserProfile = async (req, res) => {
    try {
        //find student login details
        const studentLogin = await studentlogmodel.findById(req.params.id);
        if (!studentLogin) {
            return res.status(404).json({ message: "Student login not found" });
        }

        //find student details using login id
        const studentDetails = await adminaddstudentmodel.findOne({ loginid: studentLogin._id });
        if (!studentDetails) {
            return res.status(404).json({ message: "Student details not found" });
        }

        res.json({
            studentid: studentDetails.studentid,
            studentname: studentDetails.studentname,
            dateofbirth: new Date(studentDetails.dateofbirth).toLocaleDateString(),
            guardianname: studentDetails.guardianname,
            guardianrelation: studentDetails.guardianrelation,
            bloodgroup: studentDetails.bloodgroup,
            degree: studentDetails.degree,
            department: studentDetails.department,
            semester: studentDetails.semester,
            tenth: studentDetails.tenth,
            twelve: studentDetails.twelve,
            email: studentLogin.email,
            // password: studentLogin.password
        });

    } catch (err) {
        console.error('Error in student profile:', err);
        res.status(500).json({ message: "Error fetching student profile", error: err.message });
    }
};

exports.addParentCreate = async (req, res) => {
    try {
        const parentLoginParams = {
            email: req.body.email,
            password: req.body.password,
            usertype: 4
        }
        const parentLogin = await parentlogmodel.create(parentLoginParams);
        const formattedDateOfBirth = new Date(req.body.dateofbirth).toISOString().split('T')[0]; // YYYY-MM-DD
        const addParents = {
            parentid: req.body.parentid,
            parentname: req.body.parentname,
            studentid: req.body.studentid,
            studentname: req.body.studentname,
            degree: req.body.degree,
            department: req.body.department,
            semester: req.body.semester,
            relation: req.body.relation,
            dateofbirth: formattedDateOfBirth,
            job: req.body.job,
            aadhaar: req.body.aadhaar,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            usertype: req.body.usertype,
            loginid: parentLogin._id
        };

        await addparentmodel.create(addParents);
        // Set up nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'midhunbabu0474@gmail.com',
                pass: 'haea jsez acef pmke'
            }
        });

        // Email options
        const mailOptions = {
            from: 'midhunbabu0474@gmail.com',
            to: addParents.email,
            subject: 'Parent Account Created',
            text: `Your account has been created. Here are your login details:\nEmail: ${addParents.email}\nPassword: ${addParents.password}`
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.json({ message: "Parent added successfully" });
    } catch (err) {
        console.error('Error in addParentCreate:', err);
        res.status(500).json({ error: 'Internal Server Error (addParentCreate)' });
    }
}

exports.getAttendance = async (req, res) => {
    try {
        const { studentId } = req.query;
        const attendance = await Attendance.find({ studentId }).populate('teacherId', 'teacherid teachername');
        res.status(200).json(attendance);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ success: false, message: "Failed to fetch attendance." });
    }
};

exports.getStudentExams = async (req, res) => {
    try {
        const { degree, department, semester, studentId } = req.query;

        if (!degree || !department || !semester || !studentId) {
            return res.status(400).json({ message: "Degree, department, semester, and studentId are required" });
        }


        //fetch exams corresponding to the students degree, dept, semester
        const exams = await Exam.find({ degree, department, semester });

        //fetch submissions for the student
        const submissions = await Submission.find({ studentId });

        // Add an "attended" flag to each exam
        const examsWithAttendance = exams.map((exam) => {
            const hasAttended = submissions.some((submission) => submission.examId.toString() === exam._id.toString());
            return { ...exam._doc, attended: hasAttended };
        });

        res.status(200).json(examsWithAttendance);
    } catch (err) {
        console.error("Error fetching student exams:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getExamDetails = async (req, res) => {
    try {
        const { examId } = req.params;
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(exam);
    } catch (err) {
        console.error("Error fetching exam details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.submitAnswers = async (req, res) => {
    try {
        const { examId, studentId, studentid, studentname, degree, department, semester, examDate, answers } = req.body;

        let answerSheet = null;
        if (req.files && req.files.answerSheet) {

            const file = req.files.answerSheet;
            const uploadDir = path.join(__dirname, '../public/uploads/answersheets');
            const uploadPath = path.join(uploadDir, file.name);

            //Check if the directory exixts, else create
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Move the file to the upload directory
            await file.mv(uploadPath);

            // Save the file name or path
            answerSheet = file.name;
        }

        // Parse answers if it's a JSON string
        const parsedAnswers = typeof answers === "string" ? JSON.parse(answers) : answers;

        // Save the answers or answer sheet in the database
        const submission = {
            examId,
            studentId,
            studentid,
            studentname,
            degree,
            department,
            semester,
            examDate,
            answers: parsedAnswers,
            answerSheet,
        };

        // Save submission logic here (e.g., save to a collection)
        const savedSubmission = await Submission.create(submission);

        res.status(200).json({ message: "Answers submitted successfully" });
    } catch (err) {
        console.error("Error submitting answers:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.downloadQuestionFile = async (req, res) => {
    try {
        const { fileName } = req.params;
        const filePath = path.join(__dirname, '..', 'public', 'uploads', fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File not found" });
        }

        // Set the Content-Disposition header to force download
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getStudentExamResults = async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid or missing student ID" });
        }

        // Fetch marks and populate exam details
        const marks = await Mark.find({ studentId }).populate({
            path: 'examId', // Populate the examId field
            select: 'examType mode subject dateOfExamination startTime endTime maximumMark passMark', // Select specific fields
        });

        if (!marks || marks.length === 0) {
            return res.status(404).json({ message: "No marks found for the student" });
        }

        // Format the response to include both marks and exam details
        const results = marks.map((mark) => ({
            examType: mark.examId?.examType || "N/A",
            mode: mark.examId?.mode || "N/A",
            subject: mark.examId?.subject || "N/A",
            dateOfExamination: mark.examId?.dateOfExamination || "N/A",
            startTime: mark.examId?.startTime || "N/A",
            endTime: mark.examId?.endTime || "N/A",
            maximumMark: mark.examId?.maximumMark || "N/A",
            passMark: mark.examId?.passMark || "N/A",
            mark: mark.mark,
            isPass: mark.isPass,
        }));

        res.status(200).json(results);
    } catch (err) {
        console.error("Error fetching student exam results:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getSubjects = async (req, res) => {
    try {
        const { degree, department, semester } = req.query;

        if (!degree || !department || !semester) {
            return res.status(400).json({ message: "Degree, department, and semester are required" });
        }

        const subjects = await subjectmodel.find({ degree, department, semester });

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ message: "No subjects found" });
        }

        res.status(200).json(subjects);
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
