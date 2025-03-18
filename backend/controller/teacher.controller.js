const {teacherlogmodel, teachernotificationmodel} = require('../model/teacher.model');
const {adminaddteachermodel} = require('../model/admin.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); //generating tokens, creating hashes, encrypting data


exports.teacherLogin = async (req,res) =>{
    try{
        const teacherLoginParams = {
            email: req.body.email,
            password: req.body.password
        };

        const teacher = await teacherlogmodel.findOne({email: teacherLoginParams.email});

        if (teacher) {
            if (teacher.password === teacherLoginParams.password) {
                if (teacher.usertype === 2) {
                    // Get teacher details
                    const teacherDetails = await adminaddteachermodel.findOne({ loginid: teacher._id });
                    
                    if (teacherDetails) {
                        req.session.data = teacher;
                        res.json({ ...teacher._doc, teacherDetails: teacherDetails}); // Send teacher details
                    } else {
                        res.status(404).json({ message: "Teacher details not found" });
                    }
                } else {
                    res.status(403).json({ message: "Invalid usertype" });
                }
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "Teacher not found" });
        }
    } catch (err) {
        console.error("Error in teacher login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.teacherforgotpass = async (req, res) => {
    try {
        const { email } = req.body;
        const teacher = await teacherlogmodel.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: "Email not registered" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        teacher.resetToken = resetToken;
        teacher.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await teacher.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'midhunbabu0474@gmail.com',
                pass: 'haea jsez acef pmke'
            }
        });

        const mailOptions = {
            from: 'midhunbabu0474@gmail.com',
            to: teacher.email,
            subject: 'Teacher Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/teacherresetpassword?token=${resetToken}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send password reset email" });
    }
}

exports.teacherresetPass = async (req, res) => {
    try {
        const { token, password } = req.body;

        const teacher = await teacherlogmodel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        
        if (!teacher) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Hash the new password
        // const hashedPassword = await bcrypt.hash(password, saltRounds);

        teacher.password = password;
        teacher.resetToken = undefined; // Remove the token: After updating password, remove token
        teacher.resetTokenExpiry = undefined;
        await teacher.save();

        // Update password in adminaddteacher collection
        const teacherDetails = await adminaddteachermodel.findOne({
            loginid: teacher._id
        });
        if (teacherDetails) {
            teacherDetails.password = password;
            await teacherDetails.save();
        }
        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.teacherUserProfile = async (req, res) => {
    try{
        //find teacher login details
        const teacherLogin = await teacherlogmodel.findById(req.params.id);
        if (!teacherLogin) {
            return res.status(404).json({ message: "Teacher login not found" });
        }

        //find teacher details using login id
        const teacherDetails = await adminaddteachermodel.findOne({ loginid: teacherLogin._id });
        if (!teacherDetails) {
            return res.status(404).json({ message: "Teacher details not found" });
        }
        
        res.json({
                teacherid: teacherDetails.teacherid,
                teachername: teacherDetails.teachername,
                designation: teacherDetails.designation,
                dateofbirth: new Date(teacherDetails.dateofbirth).toLocaleDateString(),
                qualification: teacherDetails.qualification,
                bloodgroup: teacherDetails.bloodgroup,
                salary: teacherDetails.salary,
                email: teacherLogin.email,
                // password: teacherLogin.password
            });

    }catch (err) {
        console.error('Error in teacher profile:', err);
        res.status(500).json({message: "Error fetching teacher profile", error: err.message});
    }
};

exports.getTeacherNotifications = async (req, res) => {
    try {
        const { teacherid } = req.params;
        const notifications = await teachernotificationmodel.find({ teacherid });
        res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Error retrieving notifications" });
    }
};


