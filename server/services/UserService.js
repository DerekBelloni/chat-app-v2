import { dbContext } from '../db/DbContext.js';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import { User } from '../models/User.js';

class UserService {
    async create(req, res) {
        let user = await dbContext.User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).send("User by that email already exists");
        }

        user = new dbContext.User(_.pick(req.body, ['username', 'email', 'password', 'isAdmin']));

        // Extract to its own function
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(_.pick(user, ['id', 'username', 'email']));
    }

    async get(req, res) {
        const user = await User.findById(req.user._id).select('-password');
        // res.send(user);
        return user;
    }

    async getAllUsers(req, res) {
        const users = await User.find().select('-password');
        return users;
    }

    // I believe best practice would be to not send req/res to service layer, to use a 'return' to return to controller
    // and then send response from controller to the client
    async registerGoogleUser(req, res) {
        let user = await dbContext.User.findOne({ email: req.body.email });

        if (user) {
            const token = user.generateAuthToken();
            return res.header("x-auth-token", token).send(_.pick(user, ['id', 'username', 'email']));
        }
        
        user = new dbContext.User(_.pick(req.body, ['username', 'email', 'isAdmin']));
        await user.save();

        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(_.pick(user, ['id', 'username', 'email']));
    }
}

export const userService = new UserService();