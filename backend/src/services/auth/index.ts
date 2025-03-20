import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { createLogger } from '../../lib/createLogger';
import { authenticateToken } from '../../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
const logger = createLogger('authservice');

const generateTokens = (userId: string) => {
  const token = jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: '7d' }
  );

  return { token, refreshToken };
};

// Register user password must have at least 6 characters and contain at least one number and one letter
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }).matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
    body('username').isLength({ min: 3 })
  ],
  async (req: Request, res: Response) => {
    logger.info('Registration request:', req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, username, name } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          name
        }
      });

      // Generate JWT
      const { token } = generateTokens(user.id);

      res.status(201).json({
        message: 'User created successfully',
        email: user.email,
        username: user.username,
        token
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Login user
router.post('/login',[
    body('email').isEmail(),
    body('password').exists()
  ], async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT
      const { token } = generateTokens(user.id);

      res.json({ email, username: user.username, token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/refresh', authenticateToken , async (req: Request, res: Response) => {
  try{
    const { userId } = req.user;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { refreshToken } = generateTokens(user.id);
    res.json({ token: refreshToken });
  } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;