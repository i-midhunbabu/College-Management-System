var express = require('express');
var router = express.Router();
var adminController = require("../controller/admin.controller");


//admin
router.post('/adminregisterIns', adminController.adminRegister);
router.get('/adminregisterView', adminController.adminRegisterView);
router.post('/adminloginIns', adminController.adminLoginInsert)
router.post('/adminloginview', adminController.adminLoginInsert)
router.post('/adminforgotpassword', adminController.adminForgotPassword)
router.post('/resetpassword', adminController.resetPassword);
router.post('/addteacher', adminController.addTeacherCreate);
router.get('/adminteacherview', adminController.adminTeacherView);
router.post('/adminteacherdelete/:id', adminController.adminTeacherDelete);
router.get('/adminteacheredit/:teacherId', adminController.adminTeacherEdit);
router.post('/adminteacherupdate', adminController.adminTeacherUpdate);
router.post('/addstudent', adminController.addStudentCreate);
router.get('/adminstudentview', adminController.adminStudentView);
router.post('/adminstudentdelete/:Id', adminController.adminStudentDelete);
router.get('/adminstudentedit/:studentid', adminController.adminStudentEdit);
router.post('/adminstudentupdate', adminController.adminStudentUpdate);
router.get('/admingetparent', adminController.adminGetParents);
router.post('/blockparent', adminController.blockParent);
router.post('/adddepartment', adminController.addDepartment);
router.get('/admindepartmentview', adminController.viewDepartment);
router.get('/admingetteacher', adminController.adminGetTeachers);
router.post('/assignteacher', adminController.assignTeacher);
router.post('/addsemester', adminController.addSemester);
router.get('/viewsemesters', adminController.viewSemesters);
router.get('/getDegreeDepartmentSemester', adminController.getDegreeDepartmentSemester);
router.post('/addsubject', adminController.addSubject);
router.get('/viewsubjects', adminController.viewSubjects);
router.post('/createexam', adminController.createExam);
router.get('/getstudentsbyclass', adminController.getStudentsByClass);
router.get('/admingetstudents', adminController.getStudents);
router.get('/getstudentsbyclass', adminController.getStudentsByClass);
router.get('/pendingExamApplications', adminController.getPendingExamApplications);
router.put('/reviewExamApplication/:examId', adminController.reviewExamApplication);
router.get('/getstudentdetails/:studentid', adminController.getStudentDetailsById);
router.get('/getnotifications', adminController.getNotifications);

module.exports = router;