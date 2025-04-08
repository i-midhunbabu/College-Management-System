const { parentlogmodel, Chat } = require('../model/parent.model');
const { addparentmodel } = require('../model/student.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.parentLoginView = async (req, res) => {
    try {
        const parentLoginParams = {
            email: req.body.email,
            password: req.body.password
        };

        const parent = await parentlogmodel.findOne({ email: parentLoginParams.email });

        if (parent) {
            if (parent.password === parentLoginParams.password) {
                if (parent.usertype === 4) {
                    // Get parent details
                    const parentDetails = await addparentmodel.findOne({ loginid: parent._id });

                    if (parentDetails) {

                        // Check if the parent is blocked
                        if (parentDetails.isBlocked) {
                            return res.status(403).json({ message: "You are not authorized to visit this page" });
                        }

                        req.session.data = parent;
                        res.json({ ...parent._doc, parentDetails: parentDetails }); // Send parent details
                    } else {
                        res.status(404).json({ message: "Parent details not found" });
                    }
                } else {
                    res.status(403).json({ message: "Invalid usertype" });
                }
            } else {
                res.status(401).json({ message: "Invalid password" });
            }
        } else {
            res.status(404).json({ message: "Parent not found" });
        }
    } catch (err) {
        console.error("Error in parent login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.parentForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const parent = await parentlogmodel.findOne({ email });
        if (!parent) {
            return res.status(400).json({ message: "Email not registered" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        parent.resetToken = resetToken;
        parent.resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
        await parent.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'midhunbabu0474@gmail.com',
                pass: 'haea jsez acef pmke'
            }
        });

        const mailOptions = {
            from: 'midhunbabu@gmail.com',
            to: parent.email,
            subject: 'Parent Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/parentresetpassword?token=${resetToken}`
        };

        await transporter.sendMail(mailOptions);
        // console.log('Reset token created:', resetToken);

        res.json({ message: "Password reset link sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send password reset email" });
    }

}

exports.parentResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        // console.log("Received token:", token);
        // console.log("Received password:", password);

        const parent = await parentlogmodel.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
        if (!parent) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash new password
        parent.password = password;
        parent.resetToken = undefined; // Remove the token: After updating password, remove token
        parent.resetTokenExpiry = undefined;
        await parent.save();

        // Update password in addparentmodel collection
        const parentDetails = await addparentmodel.findOne({
            loginid: parent._id
        });
        if (parentDetails) {
            parentDetails.password = password;
            await parentDetails.save();
        }

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.parentUserProfile = async (req, res) => {
    try {
        //find parent login details
        const parentLogin = await parentlogmodel.findById(req.params.id);
        if (!parentLogin) {
            return res.status(404).json({ message: "Parent login not found" });
        }

        //find parent details using login id
        const parentDetails = await addparentmodel.findOne({ loginid: parentLogin._id });
        if (!parentDetails) {
            return res.status(404).json({ message: "Parent details not found" });
        }

        res.json({
            parentid: parentDetails.parentid,
            parentname: parentDetails.parentname,
            studentid: parentDetails.studentid,
            studentname: parentDetails.studentname,
            department: parentDetails.department,
            semester: parentDetails.semester,
            relation: parentDetails.relation,
            dateofbirth: new Date(parentDetails.dateofbirth).toLocaleDateString(),
            job: parentDetails.job,
            aadhaar: parentDetails.aadhaar,
            mobile: parentDetails.mobile,
            email: parentLogin.email,
            // password: parentLogin.password
        });

    } catch (err) {
        console.error('Error in parent profile:', err);
        res.status(500).json({ message: "Error fetching parent profile", error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { requestId, senderId, receiverId, message } = req.body;

        // console.log("Received Payload:", req.body);

        if (!requestId || !senderId || !receiverId || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newMessage = new Chat({
            requestId,
            senderId,
            receiverId,
            message,
        });

        await newMessage.save();

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { requestId } = req.params;
        // console.log("Fetching messages for Request ID:", requestId);

        const messages = await Chat.find({ requestId }).sort({ createdAt: 1 });
        // console.log("Fetched messages:", messages);
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};
