const { studentlogmodel, addparentmodel } = require('../model/student.model');
const { adminaddstudentmodel } = require('../model/admin.model');
const { parentlogmodel } = require('../model/parent.model');
const { Attendance } = require('../model/teacher.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
