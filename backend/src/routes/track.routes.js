import express from 'express';
import { uploadTrack } from '../middlewares/upload.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { uploadAudio } from '../controllers/track.controller.js';
import { getUserTracks, getTrack, deleteTrack } from '../controllers/track.controller.js';

const router = express.Router();

router.post(
  '/',
  requireAuth,
  uploadTrack.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  uploadAudio
);

router.get('/', requireAuth, getUserTracks);
router.get('/:id', requireAuth, getTrack);
router.delete('/:id', requireAuth, deleteTrack);

export default router;
