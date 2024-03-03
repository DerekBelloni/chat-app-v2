import { profileService } from "../services/ProfileService.js";

export class ProfileController {
    static async store(req, res) {
        const response = await profileService.store(req);
        res.send(response);
    }
}