var express = require('express');
var router = express.Router();
var teacherController = require('../controller/teacher.controller')

//login
router.post('/teacherlogin', teacherController.teacherLogin);
router.post('/teacherforgotpassword', teacherController.teacherforgotpass);
router.post('/teacherresetpassword', teacherController.teacherresetPass);
router.get('/teacherprofile/:id', teacherController.teacherUserProfile);
router.get('/teachernotifications/:teacherid', teacherController.getTeacherNotifications);
//course materials
router.post('/uploadcoursematerial', teacherController.uploadCourseMaterial);
router.get('/coursematerials', teacherController.getCourseMaterials);
router.get('/coursematerials/:id/download', teacherController.downloadCourseMaterial);
//attendance
router.post('/mark', teacherController.markAttendance);
router.get('/get', teacherController.getAttendance);
//exam
router.post('/createexam', teacherController.createExam);
router.post('/uploadquestionfile', teacherController.uploadQuestionFile);
router.get('/degreesanddepartments', teacherController.getDegreesAndDepartments);
router.get('/semesters', teacherController.getSemesters);
router.get('/getexams', teacherController.getExams);
router.delete('/deleteexam/:examId', teacherController.deleteExam);
router.get('/getexam/:examId', teacherController.getExam);
router.post('/updateexam/:examId', teacherController.updateExam);

module.exports = router;