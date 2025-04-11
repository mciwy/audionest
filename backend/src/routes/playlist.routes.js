import express from 'express';
import {
  createPlaylist,
  getAllPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist
} from '../controllers/playlist.controller.js';

import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', createPlaylist);
router.get('/', getAllPlaylists);
router.get('/:id', getPlaylistById);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

export default router;
