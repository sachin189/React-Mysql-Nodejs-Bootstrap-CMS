const express = require('express');
const router = express.Router();
const ManageUserController = require('../../controllers/manage/user.controller');
const auth = require('../../middleware/auth.middleware');
const Role = require('../../utils/userRoles.utils');
const awaitHandlerFactory = require('../../middleware/awaitHandlerFactory.middleware');

const { createUserSchema, updateUserSchema, validateLogin, validateChangePassword } = require('../../middleware/validators/userValidator.middleware');


//router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
//router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
//router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByuserName)); // localhost:3000/api/v1/users/usersname/julia
//router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
//router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/users
//router.patch('/id/:id', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
//router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/1


router.post('/login', validateLogin, awaitHandlerFactory(ManageUserController.userLogin)); // localhost:3000/api/v1/users/login
router.get('/usermenu', auth(), awaitHandlerFactory(ManageUserController.menu)); // localhost:3000/api/v1/users/login
router.post('/change-password', auth(Role.Admin), validateChangePassword, awaitHandlerFactory(ManageUserController.userChangePassword)); // localhost:3000/api/v1/users/login
router.post('/add', auth(), createUserSchema, awaitHandlerFactory(ManageUserController.createUser)); // localhost:3000/api/v1/users

module.exports = router;