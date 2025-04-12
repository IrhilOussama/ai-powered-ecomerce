import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../config/cloudinary.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(currentDir, '..', '..', 'public', 'images');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  }
});

// Extend Express Request type to include Multer and Cloudinary properties
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      cloudinaryImage?: {
        secure_url: string;
        public_id?: string;
        [key: string]: any;
      };
    }
  }
}

// Memory storage for efficient processing
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    console.log('File received:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname
    });

    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Cloudinary upload middleware
const cloudinaryUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Full request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);

    if (!req.file) {
      console.log('No file found in request');
      return next();
    }

    // Convert buffer to base64
    const base64Image = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'categories', // or dynamic folder based on context
      transformation: [
        { width: 500, crop: 'scale' }, // Optional: resize image
        { quality: 'auto' } // Optimize image quality
      ]
    });

    // Attach Cloudinary result to request
    req.cloudinaryImage = uploadResult;
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    next(error);
  }
};

export { upload, cloudinaryUpload };

// Deprecated: Keep for backwards compatibility
export const saveBase64Image = async (base64Data: any) => {
  const base64Image = base64Data.split(';base64,').pop();
  
  let fileExtension = 'jpg';
  if (base64Data.includes('data:image/')) {
    fileExtension = base64Data.split(';')[0].split('/')[1];
  }
  
  const fileName = `${uuidv4()}.${fileExtension}`;
  const filePath = path.join(currentDir, '..', '..', 'public', 'images', fileName);

  await fsPromises.writeFile(filePath, base64Image, { encoding: 'base64' });
  return fileName;
};
