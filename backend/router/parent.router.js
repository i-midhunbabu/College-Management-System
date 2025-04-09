var express = require ('express');
var router = express.Router();
var parentController = require ('../controller/parent.controller');

//parent
router.post('/parentloginview', parentController.parentLoginView);
router.post('/parentforgotpassword', parentController.parentForgotPassword);
router.post('/resetpassword', parentController.parentResetPassword);
router.get('/parentprofile/:id',parentController.parentUserProfile);
router.post('/sendMessage', parentController.sendMessage);
router.get('/getMessages/:requestId', parentController.getMessages);
router.get('/unreadCounts/:parentId', parentController.getUnreadCounts);
router.put('/markMessagesAsRead', parentController.markMessagesAsRead);
module.exports = router;