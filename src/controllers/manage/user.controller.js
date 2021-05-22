const UserModel = require('../../models/manage/user.model');
const HttpException = require('../../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    
    getAllUsers = async (req, res, next) => {
        
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ id: req.params.id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { password, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getCurrentUser = async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    createUser = async ( req, res, next ) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const result = await UserModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User was created!');
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        const { confirm_password, ...restOfUpdates } = req.body;

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(restOfUpdates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteUser = async (req, res, next) => {
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { username:admin_username , password: pass } = req.body;

        const user = await UserModel.findOne({ admin_username });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }
        //console.log(pass);
        const isMatch = await bcrypt.compare(pass, user.admin_password );

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        const userPayload = { user_id:user.admin_id,user_role:user.admin_upm_id }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign( userPayload, secretKey, {
            expiresIn: '1h'
        });

        const { password, ...userWithoutPassword } = user;
        //console.log(getAuthMenu);
        //return false;
        //res.send({ ...userWithoutPassword, token });
        res.send({ token });
    };

    userChangePassword = async (req, res, next) => {
        this.checkValidation(req);
        res.send('User');
    };

    menu =  async (req, res, next) => {
        let t = {};
        //console.log(req.currentUser.admin_upm_id);
        const UserPrevilege = await UserModel.getUserPrevilege(req.currentUser.admin_upm_id);
        const UserMenu = await UserModel.getUserMenu(UserPrevilege);
        UserMenu.forEach(o => {
            Object.assign( t[o.id] = t[o.id] || {}, o);
            t[o.p_menu_id] = t[o.p_menu_id] || { children:[] };
            t[o.p_menu_id].children = t[o.p_menu_id].children || [];
            t[o.p_menu_id].children.push(t[o.id]);
        })
        //console.log(typeof t[0]);
        res.send(t[0].children);
    };
    
    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;