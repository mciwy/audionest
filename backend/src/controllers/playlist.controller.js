import prisma from '../prisma/client.js';

export const createPlaylist = async (req, res) => {
  const { name, trackIds = [] } = req.body;
  const userId = req.user.userId;

  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        userId,
        playlistTracks: {
          create: trackIds.map(trackId => ({
            track: { connect: { id: trackId } }
          }))
        }
      }
    });

    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Error creating playlist', error: err.message });
  }
};

export const getAllPlaylists = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const playlists = await prisma.playlist.findMany({
        where: { userId },
        include: {
          playlistTracks: {
            include: { track: true }
          }
        }
      });
  
      res.json(playlists);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching playlists', error: err.message });
    }
  };

export const getPlaylistById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const playlist = await prisma.playlist.findFirst({
      where: { id, userId },
      include: {
        playlistTracks: {
          include: { track: true }
        }
      }
    });

    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching playlist', error: err.message });
  }
};

export const updatePlaylist = async (req, res) => {
    const { id } = req.params;
    const { name, trackIds = [] } = req.body;
    const userId = req.user.userId;
  
    try {
      await prisma.playlistTrack.deleteMany({ where: { playlistId: id } });
  
      const updated = await prisma.playlist.update({
        where: { id },
        data: {
          name,
          playlistTracks: {
            create: trackIds.map(trackId => ({
              track: { connect: { id: trackId } }
            }))
          }
        },
        include: {
          playlistTracks: {
            include: { track: true }
          }
        }
      });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Error updating playlist', error: err.message });
    }
  };

export const deletePlaylist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const playlist = await prisma.playlist.findFirst({
      where: { id, userId }
    });

    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

    await prisma.playlistTrack.deleteMany({ where: { playlistId: id } });
    await prisma.playlist.delete({ where: { id } });

    res.json({ message: 'Playlist deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting playlist', error: err.message });
  }
};
