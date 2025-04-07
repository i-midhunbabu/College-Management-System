const { adminregmodel, adminloginmodel, adminaddteachermodel, adminaddstudentmodel, departmentmodel, assignedteachermodel, semestermodel, subjectmodel, exammodel, notificationModel } = require('../model/admin.model');
const { teacherlogmodel, teachernotificationmodel, Exam } = require('../model/teacher.model')
const { studentlogmodel, addparentmodel } = require('../model/student.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt'); //hashing passwords
const saltRounds = 10; //complexity of the hashing (here 10)
const crypto = require('crypto'); //generating tokens, creating hashes, encrypting data
const { error } = require('console');

exports.adminRegister = async (req, res) => {
    try {
        // const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); //hashing the password
        let adminlogparams = {
            email: req.body.email,
            // password: hashedPassword, //storing the hashed password
            password: req.body.password,
            adminname: req.body.adminname,
            usertype: req.body.usertype
        };
        var key = await adminloginmodel.create(adminlogparams);
        let adminregparams = {
            adminname: req.body.adminname,
            loginid: key._id
        }
        await adminregmodel.create(adminregparams);
        res.json({ message: "Admin Registered" })
    } catch (err) {
        console.error("Admin not registered", err);
        res.status(500).json({ message: "Registration failed" });
    }
}

exports.adminRegisterView = async (req, res) => {
    try {
        const find = await adminregmodel.find();
        res.json(find);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to retrieve admin data" });
    }
}

exports.adminLoginInsert = (async (req, res) => {
    try {
        let adminloginparams = {
            email: req.body.email,
            password: req.body.password
        }
        let admin = await adminloginmodel.findOne({ email: adminloginparams.email })
        if (admin) {
            if (admin.password == adminloginparams.password) {
                if (admin.usertype == 1) {
                    const adminDetails = await adminregmodel.findOne({ loginid: admin._id });
                    if (adminDetails) {
                        req.session.data = admin;
                        res.json({ ...admin._doc, adminDetails: adminDetails });
                        // res.json(admin)
                    } else {
                        console.log("Admin details not found");
                    }
                } else {
                    console.log("Invalid Usertype (for admin)");

                }
            } else {
                console.log("Invalid Password (for admin)");

            }
        } else {
            console.log("Invalid Email (for admin)");

        }
    } catch (err) {
        console.error("Error in admin login", err);
    }
})

exports.adminForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await adminloginmodel.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Email not registered" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        admin.resetToken = resetToken;
        admin.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await admin.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'midhunbabu0474@gmail.com',
                pass: 'haea jsez acef pmke'
            }
        });

        const mailOptions = {
            from: 'midhunbabu@gmail.com',
            to: admin.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/resetpassword?token=${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send password reset email" });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const admin = await adminloginmodel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!admin) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash new password
        admin.password = password;
        admin.resetToken = undefined; // Remove the token: After updating password, remove token
        admin.resetTokenExpiry = undefined;
        await admin.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Add Teacher- Admin
exports.addTeacherCreate = async (req, res) => {
    try {
        //create teacher login entry
        const teacherLoginParams = {
            email: req.body.email,
            password: req.body.password,
            usertype: 2
        };
        const teacherLogin = await teacherlogmodel.create(teacherLoginParams);
        const formattedDateofBirth = new Date(req.body.dateofbirth).toISOString().split('T')[0];

        //teacher details with reference to login
        const addteacher = {
            teacherid: req.body.teacherid,
            teachername: req.body.teachername,
            designation: req.body.designation,
            dateofbirth: formattedDateofBirth,
            qualification: req.body.qualification,
            email: req.body.email,
            password: req.body.password,
            salary: req.body.salary,
            usertype: req.body.usertype,
            loginid: teacherLogin._id,// Reference to teacher login
        };

        await adminaddteachermodel.create(addteacher);

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
            to: addteacher.email,
            subject: 'Teacher Account Created',
            text: `Your account has been created. Here are your login details:\nEmail: ${addteacher.email}\nPassword: ${addteacher.password}`
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Teacher created successfully' });
    } catch (err) {
        console.error("Error in addTeacherCreate:", err);
        res.status(500).json({ error: 'Internal Server Error (addTeacherCreate)' })

    }
}

exports.adminTeacherView = async (req, res) => {
    try {
        const viewTeacherList = await adminaddteachermodel.find();
        res.json(viewTeacherList);
    } catch (err) {
        console.log(err);
    }
}

exports.adminTeacherDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await adminaddteachermodel.findById(id);

        if (!teacher) {
            return res.json({ success: false, message: "Teacher not found" });
        }

        await Promise.all([
            adminaddteachermodel.findByIdAndDelete(id),
            teacherlogmodel.findByIdAndDelete(teacher.loginid)
        ]);
        res.json({ success: true, message: "Teacher deleted successfully from both collections", data: teacher });

    } catch (err) {
        console.error("Error in teacher deletion:", err);
        res.status(500).json({ success: false, message: "Error deleting student from collections" });

    }
};

exports.adminTeacherEdit = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const teacher = await adminaddteachermodel.findById(teacherId);
        if (!teacher) {
            res.status(400).json({ error: "Teacher not found" });
        }
        res.json(teacher); //send the teacher data 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });

    }
};

exports.adminTeacherUpdate = async (req, res) => {
    try {
        const formattedDateofBirth = new Date(req.body.dateofbirth).toISOString().split('T')[0];

        const params = {
            teacherid: req.body.teacherid,
            teachername: req.body.teachername,
            designation: req.body.designation,
            dateofbirth: formattedDateofBirth,
            qualification: req.body.qualification,
            email: req.body.email,
            password: req.body.password,
            salary: req.body.salary,
        }

        let upid = await adminaddteachermodel.findByIdAndUpdate(req.body.id, params);
        res.json(upid);
    } catch (err) {
        console.log(err);
    }
}

//adminaddstudent 
exports.addStudentCreate = async (req, res) => {
    try {
        const formattedDateofBirth = new Date(req.body.dateofbirth).toISOString().split('T')[0];
        //create student login entry
        const studentLoginParams = {
            email: req.body.email,
            password: req.body.password,
            usertype: 3
        };

        const studentLogin = await studentlogmodel.create(studentLoginParams);

        //student details with reference to login
        const addStudent = {
            studentid: req.body.studentid,
            studentname: req.body.studentname,
            dateofbirth: req.body.dateofbirth,
            guardianname: req.body.guardianname,
            guardianrelation: req.body.guardianrelation,
            bloodgroup: req.body.bloodgroup,
            degree: req.body.degree,
            department: req.body.department,
            semester: req.body.semester,
            tenth: req.body.tenth,
            twelve: req.body.twelve,
            email: req.body.email,
            password: req.body.password,
            usertype: req.body.usertype,
            loginid: studentLogin._id // Reference to student login
        };

        await adminaddstudentmodel.create(addStudent);

        //setup nodemailer transporter
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
            to: addStudent.email,
            subject: 'Student Account Created',
            text: `Your account has been created. Here are your login details:\nEmail: ${addStudent.email}\nPassword: ${addStudent.password}`
        };
        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Student created successfully' });
    } catch (err) {
        console.error("Error in adminAddStudent:", err);
        res.status(500).json({ error: 'Internal Server Error (addStudentCreate)' })
    }
}

exports.adminStudentView = async (req, res) => {
    try {
        const viewStudentList = await adminaddstudentmodel.find();
        res.json(viewStudentList);
    } catch (err) {
        console.log(err);
    }
}

exports.adminStudentDelete = async (req, res) => {
    try {
        const { Id } = req.params;
        const student = await adminaddstudentmodel.findById(Id);

        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        await Promise.all([
            adminaddstudentmodel.findByIdAndDelete(Id),
            studentlogmodel.findByIdAndDelete(student.loginid)
        ]);

        res.json({ success: true, message: "Student deleted successfully from both collections", data: student });
    } catch (err) {
        console.error("Error in student deletion:", err);
        res.status(500).json({ success: false, message: "Error deleting student from collections" });
    }
};

//         const delStudentList = await adminaddstudentmodel.findByIdAndDelete(Id);
//         if (delStudentList) {
//             // Delete from teacherlogmodel
//             // await teacherlogmodel.findOneAndDelete({ email: delTeacherList.email });
//             res.json({ success: true, message: "Student Deleted Successfully", data: delStudentList })
//         } else {
//             res.json({ success: false, message: "Student not found" });
//         }

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, message: "Error deleting student" })

//     }
// };

exports.adminStudentEdit = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await adminaddstudentmodel.findById(studentid);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student); //send the student data 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });

    }
};

exports.adminStudentUpdate = async (req, res) => {
    try {
        const formattedDateofBirth = new Date(req.body.dateofbirth).toISOString().split('T')[0];
        const params = {
            studentid: req.body.studentid,
            studentname: req.body.studentname,
            dateofbirth: formattedDateofBirth,
            guardianname: req.body.guardianname,
            guardianrelation: req.body.guardianrelation,
            bloodgroup: req.body.bloodgroup,
            degree: req.body.degree,
            department: req.body.department,
            semester: req.body.semester,
            tenth: req.body.tenth,
            twelve: req.body.twelve,
            email: req.body.email,
            password: req.body.password,
        }

        let upid = await adminaddstudentmodel.findByIdAndUpdate(req.body.id, params);
        res.json(upid);
    } catch (err) {
        console.log(err);
    }
};

exports.adminGetParents = async (req, res) => {
    try {
        const parents = await addparentmodel.find();
        res.json(parents);
    } catch (err) {
        console.error("Error fetching parents:", err);
        res.status(500).json({ message: "Error retrieving parents" });
    }
};

exports.blockParent = async (req, res) => {
    try {
        const { parentid } = req.body;
        const parent = await addparentmodel.findOneAndUpdate({ parentid }, { isBlocked: true }, { new: true })
        if (!parent) {
            return res.status(404).json({ message: "Parent not found" })
        }
        //setup nodemailer transporter
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
            to: parent.email,
            subject: 'Parent Account Blocked',
            text: `Dear ${parent.parentname}, \n\nYour account has been blocked by the administrator. You will be no longer be able to access the parent portal.`
        };
        // Send email
        await transporter.sendMail(mailOptions);


        res.json({ message: "Parent blocked", parent })
    } catch (err) {
        console.error("Error blocking parent:", err)
        res.status(500).json({ erroe: "Internal server error" })

    }
};

exports.addDepartment = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const addDepartment = {
            degree: req.body.degree,
            department: req.body.department,
        };
        await departmentmodel.create(addDepartment);
        res.json({ message: "Department added successfully" })
    } catch (err) {
        console.error("Error adding department", err);
        res.status(500).json({ error: "Internal server error" })
    }
};


exports.viewDepartment = async (req, res) => {
    try {
        const viewDepartment = await departmentmodel.find();
        res.json(viewDepartment);
    } catch (err) {
        console.log("Error fetching departments:", err);
        res.status(500).json({ message: "Error retrieving departments" });
    }
};

exports.adminGetTeachers = async (req, res) => {
    try {
        const teachers = await adminaddteachermodel.find();
        res.json(teachers);
    } catch (err) {
        console.error("Error fetching teachers:", err);
        res.status(500).json({ message: "Error retrieving teachers" });
    }
};

exports.assignTeacher = async (req, res) => {
    try {
        const { teacherid, teachername, assignedclass, subject, department } = req.body;

        const newAssignment = {
            teacherid,
            teachername,
            assignedclass,
            subject,
            department,
        };

        await assignedteachermodel.create(newAssignment);

        // Create a notification for the teacher
        const notification = new teachernotificationmodel({
            teacherid,
            message: `You have been assigned to Class: ${assignedclass.join(', ')} \nSubject: ${subject.join(', ')} \n Departments: ${department.join(', ')}.`,
        });

        await notification.save();

        res.status(200).json({ success: true, message: "Teacher assigned successfully!" });
    } catch (err) {
        console.error("Error assigning teacher:", err);
        res.status(500).json({ success: false, message: "Failed to assign teacher." });
    }
};

exports.addSemester = async (req, res) => {
    try {
        const { degree, department, semesters } = req.body;

        if (!degree || !department || semesters.length === 0) {
            return res.status(400).json({ message: "Degree, department, and semesters are required." });
        }

        const newSemester = {
            degree,
            department,
            semesters,
        };

        await semestermodel.create(newSemester);
        res.json({ message: "Semester added successfully!" });
    } catch (err) {
        console.error("Error adding semester:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.viewSemesters = async (req, res) => {
    try {
        // const semesters = await semestermodel.find({}, { degree: 1, department: 1 });
        const semesters = await semestermodel.find();
        res.json(semesters);
    } catch (err) {
        console.error("Error fetching semesters:", err);
        res.status(500).json({ message: "Error retrieving semesters" });
    }
};

exports.getDegreeDepartmentSemester = async (req, res) => {
    try {
        const semesters = await semestermodel.find();
        res.json(semesters);
    } catch (err) {
        console.error("Error fetching degree, department, and semester:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addSubject = async (req, res) => {
    try {
        const { degree, department, semester, subject } = req.body;

        if (!degree || !department || !semester || !subject) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newSubject = new subjectmodel({
            degree,
            department,
            semester,
            subject,
        });

        await newSubject.save();
        res.json({ message: "Subject added successfully!" });
    } catch (err) {
        console.error("Error adding subject:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.viewSubjects = async (req, res) => {
    try {
        const subjects = await subjectmodel.find();
        res.json(subjects);
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).json({ message: "Error retrieving subjects" });
    }
};

exports.createExam = async (req, res) => {
    try {
        const { examType, mode } = req.body;
        const newExam = new exammodel({ examType, mode });
        await newExam.save();
        res.status(201).json({ message: "Exam created successfully", exam: newExam });
    } catch (error) {
        console.error("Error creating exam:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.getStudentsByClass = async (req, res) => {
    try {
        const { degree, department, semester } = req.query;
        const students = await adminaddstudentmodel.find({ degree, department, semester });
        res.json(students);
    } catch (err) {
        console.error("Error fetching students by class:", err);
        res.status(500).json({ message: "Error retrieving students" });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const students = await adminaddstudentmodel.find();
        res.status(200).json(students);
    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).json({ success: false, message: "Failed to fetch students." });
    }
};

exports.getPendingExamApplications = async (req, res) => {
    try {
        const pendingExams = await Exam.find({ examType: 'semester', approvalStatus: 'Pending' });
        res.status(200).json(pendingExams);
    } catch (err) {
        console.error('Error fetching pending exam applications:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.reviewExamApplication = async (req, res) => {
    try {
        const { examId } = req.params;
        const { approvalStatus, remarks } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam application not found' });
        }

        exam.approvalStatus = approvalStatus;
        exam.remarks = approvalStatus === 'Rejected' ? remarks : null;
        await exam.save();

        res.status(200).json({ message: `Exam application ${approvalStatus.toLowerCase()} successfully`, exam });
    } catch (err) {
        console.error('Error reviewing exam application:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStudentDetailsById = async (req, res) => {
    try {
        const { studentid } = req.params;
        const student = await adminaddstudentmodel.findOne({ studentid });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (err) {
        console.error("Error fetching student details:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getNotifications = async (req, res) => {
    try {
        // Fetch notifications from the database
        const notifications = await notificationModel.find().sort({ createdAt: -1 }); // Sort by latest first
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};