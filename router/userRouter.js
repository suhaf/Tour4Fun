const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController')
//console.log(authController);

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);
router.patch('/updatepassword', authController.checkAccess, authController.updatePassword);
 


router
    .route('/')
    .get(userController.getAllusers)
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);

module.exports = router;