var express = require ('express');
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






module.exports = router;