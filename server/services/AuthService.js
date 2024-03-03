import { dbContext } from '../db/DbContext.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import dotenv from 'dotenv';
dotenv.config();

class AuthService {
    async get(req, res) {
        let user = await dbContext.User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        
        if (!validPassword) {
            return res.status(400).send("Invalid email or password");
        }

        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(_.pick(user, ['id', 'username', 'email', 'profilePic']));
    }

    async validate(req, res) {
        let user = await dbContext.User.findOne({ email: req.body.email });
        return user;
    }

    async validateGoogleID(req, res) {
        let user = await dbContext.User.findOne({ email: req.body.email });

        const token = user.generateAuthToken();
        res.header("x-auth-token", token).send(_.pick(user, ['id', 'username', 'email']));
    }
}

export const authService = new AuthService();