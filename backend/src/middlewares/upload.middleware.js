import multer from 'multer';
import path from 'path';
import fs from 'fs';

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = 'uploads/audio';
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-audio${ext}`);
  }
});

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = 'uploads/covers';
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-cover${ext}`);
  }
});

export const uploadTrack = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isAudio = file.fieldname === 'audio';
      const dest = isAudio ? 'uploads/audio' : 'uploads/covers';
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const suffix = file.fieldname === 'audio' ? 'audio' : 'cover';
      cb(null, `${Date.now()}-${suffix}${ext}`);
    }
  })
});
