var express = require('express');
var router = express.Router();
var teacherController = require('../controller/teacher.controller')

//teacher
router.post('/teacherlogin', teacherController.teacherLogin);
router.post('/teacherforgotpassword', teacherController.teacherforgotpass);
router.post('/teacherresetpassword', teacherController.teacherresetPass);
router.get('/teacherprofile/:id',teacherController.teacherUserProfile);
router.get('/teachernotifications/:teacherid', teacherController.getTeacherNotifications); 




module.exports = router;