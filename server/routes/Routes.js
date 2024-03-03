import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { UserController } from '../controllers/UserController.js';
import { AuthController } from '../controllers/AuthController.js';
import { ChatRoomController } from '../controllers/ChatRoomController.js';
import { ProfileController } from '../controllers/ProfileController.js';
import { ImageController } from '../controllers/ImageController.js';
import upload from '../middleware/Upload.js';
import auth from '../middleware/Auth.js';
dotenv.config();

const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Auth/Login
router.post('/auth', AuthController.get);

// Auth/Validate
router.post('/validate', auth, AuthController.validate)

// Auth/Google
router.post('/validate/google', AuthController.validateGoogleID);

// Register User
router.post('/register', UserController.create);

// Register User with Google
router.post('/register/google', UserController.validateGoogleID);

// Get Current User
router.get('/me', auth, UserController.get);

// Get All Users
router.get('/users/all', UserController.getAll);

// Get All Chat Rooms
router.get('/chatrooms/get', ChatRoomController.getAll);

// Store Profile Picture
router.post('/profile/picture/:accountId/store', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    if (req.body.fileToRemove) {
        const filePath = path.join(__dirname, '..', 'uploads', req.body.fileToRemove);
        fs.unlink(filePath, (err) => {
            if (err) console.log("Error removing file: ", err);
            else {
                console.log(`\nDeleted file: ${req.body.fileToRemove}`);
            }
        })
    }

    await ProfileController.store(req, res);

    req.body.filename = req.file.filename;
    await ImageController.getProfilePic(req, res);
})

// Get Profile Picture
router.post('/images/:accountID', ImageController.getProfilePic);


export default router;