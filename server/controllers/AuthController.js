import { authService } from '../services/AuthService.js';
import { OAuth2Client } from 'google-auth-library';

export class AuthController {
    static async get(req, res) {
        try {
            await authService.get(req, res);
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    static async validate(req, res) {
       try {
            const user = await authService.validate(req, res)
            res.send(user);
       } catch (error) {
            console.log('Error: ', error);
       }
    }

    static async validateGoogleID(req, res) {
        const client = new OAuth2Client();
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: req.body.client_id
        });
        const payload = ticket.getPayload();
        req.body.email = payload.email;

        await authService.validateGoogleID(req, res);
    }
}