// photoUpload.js
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';

// When using ES modules, __dirname is not defined, so we derive it as follows:
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the storage location for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/'); // Make sure this path is correct
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Ensure filenames are correctly generated
  }
});

const upload = multer({ storage: storage });

export default upload;
