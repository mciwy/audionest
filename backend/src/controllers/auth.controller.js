import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash
      }
    });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successful' });
};

export const getCurrentUser = async (req, res) => {
  try {
    console.log('[getCurrentUser] Decoded user from token:', req.user); // 🔍 лог JWT-пользователя

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      console.warn('[getCurrentUser] No user found in database');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('[getCurrentUser] User found:', user);
    res.json(user);
  } catch (err) {
    console.error('[getCurrentUser] Server error:', err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};
