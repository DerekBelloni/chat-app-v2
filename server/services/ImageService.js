import path from 'path';
import { promises as fs } from 'fs';

class ImageService {
    async getProfilePic(filename) {
        const filePath = path.resolve(process.cwd(), 'uploads', filename);
        try {
            const profilePic = await fs.readFile(filePath);
            if (profilePic) {
                return profilePic;
            } else {
                return { statusCode: 404, message: 'Profile picture not found' };
            }
        } catch (error) {
            console.error("Error reading the file: ", error);
        }
    }
}
export const imageService = new ImageService();