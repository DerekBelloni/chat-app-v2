import { imageService } from '../services/ImageService.js'

export class ImageController {
    static async getProfilePic(req, res) {
        const filename = req.body.filename;
        try {
            const response = await imageService.getProfilePic(filename);
            res.setHeader('Content-Type', 'image/webp');
            res.send(response);
        } catch (error) {
            
        }
    }
}