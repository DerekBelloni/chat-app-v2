import { dbContext } from '../db/DbContext.js'

class ProfileService {
    async store(req) {
        const user = await dbContext.User.findById(req.params.accountId);

        if (!user) {
            throw new Error("User not found");
        }
        user.profilePic = req.file.filename;
        user.save();

        return user.profilePic;
    }
}

export const profileService = new ProfileService();