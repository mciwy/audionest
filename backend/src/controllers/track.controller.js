import prisma from '../prisma/client.js';
import path from 'path';

export const uploadAudio = async (req, res) => {
  const { title, artist } = req.body;
  const userId = req.user.userId;

  const audioFile = req.files.audio?.[0];
  const coverFile = req.files.cover?.[0];

  if (!audioFile) {
    return res.status(400).json({ message: 'Audio file is required' });
  }

  try {
    const newTrack = await prisma.track.create({
      data: {
        title,
        artist,
        audioUrl: `/uploads/audio/${path.basename(audioFile.path)}`,
        coverUrl: coverFile ? `/uploads/covers/${path.basename(coverFile.path)}` : null,
        ownerId: userId
      }
    });

    res.status(201).json({ message: 'Track uploaded', track: newTrack });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserTracks = async (req, res) => {
    const userId = req.user.userId;
  
    try {
      const tracks = await prisma.track.findMany({
        where: { ownerId: userId },
        orderBy: { title: 'asc' }
      });
  
      res.json(tracks);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

export const getTrack = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const track = await prisma.track.findFirst({
      where: { id, ownerId: userId }
    });

    if (!track) return res.status(404).json({ message: 'Track not found' });

    res.json(track);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

import fs from 'fs';

export const deleteTrack = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const track = await prisma.track.findFirst({
      where: { id, ownerId: userId }
    });

    if (!track) return res.status(404).json({ message: 'Track not found' });

    if (track.audioUrl) fs.unlinkSync(`.${track.audioUrl}`);
    if (track.coverUrl) fs.unlinkSync(`.${track.coverUrl}`);

    await prisma.track.delete({ where: { id } });

    res.json({ message: 'Track deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting track', error: err.message });
  }
};
