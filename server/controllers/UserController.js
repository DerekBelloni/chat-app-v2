import { userService } from '../services/UserService.js';
import { OAuth2Client } from 'google-auth-library';

export class UserController {
    static async create(req, res) {
        try {
            await userService.create(req, res);
        } catch (error) {
            console.log('Error: ', error);
            res.status(500).json({ error: 'An error occurred'});
        }
    }

    static async get(req, res) {
        try {
            const user = await userService.get(req, res);
            res.send(user);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    static async getAll(req, res) {
        try {
            const users = await userService.getAllUsers(req, res);
            res.send(users);
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    // You are doing this twice, abstract to a module
    static async validateGoogleID(req, res) {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: req.body.client_id
        });
        const payload = ticket.getPayload();

        req.body.email = payload.email;
        req.body.username = payload.given_name;
        req.body.isAdmin = false;

        await userService.registerGoogleUser(req, res);
    }
};