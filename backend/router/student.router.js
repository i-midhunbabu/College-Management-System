var express = require('express');
var router = express.Router();
var studentController = require('../controller/student.controller');
// var adminController = require("../controller/admin.controller");
// const { adminaddstudentmodel } = require('../model/admin.model');



//student
router.post('/studentloginview', studentController.studentLoginView);
router.post('/studentforgotpassword', studentController.studentForgotPassword);
router.post('/resetpassword', studentController.studentResetPassword);
router.get('/studentprofile/:id', studentController.studentUserProfile);
router.post('/addparent', studentController.addParentCreate);
router.get('/getattendance', studentController.getAttendance);
router.get('/getstudentexams', studentController.getStudentExams);
router.get('/getexamdetails/:examId', studentController.getExamDetails);
router.post('/submitanswers', studentController.submitAnswers);
router.get('/download/:fileName', studentController.downloadQuestionFile);

module.exports = router;