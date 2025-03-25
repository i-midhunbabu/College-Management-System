var express = require('express');
var router = express.Router();
var teacherController = require('../controller/teacher.controller')

//teacher
router.post('/teacherlogin', teacherController.teacherLogin);
router.post('/teacherforgotpassword', teacherController.teacherforgotpass);
router.post('/teacherresetpassword', teacherController.teacherresetPass);
router.get('/teacherprofile/:id', teacherController.teacherUserProfile);
router.get('/teachernotifications/:teacherid', teacherController.getTeacherNotifications);
router.post('/uploadcoursematerial', teacherController.uploadCourseMaterial);
router.get('/coursematerials', teacherController.getCourseMaterials);
router.get('/coursematerials/:id/download', teacherController.downloadCourseMaterial);
router.post('/mark', teacherController.markAttendance);
router.get('/get', teacherController.getAttendance);



module.exports = router;