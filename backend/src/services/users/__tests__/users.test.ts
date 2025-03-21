import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import express from 'express';
import userRoutes from '../index';
import { authenticateToken } from '../../../middleware/auth';
import {describe, expect} from '@jest/globals';

const app = express();
app.use(express.json());
app.use(authenticateToken);
app.use('/api/users', userRoutes);

const prisma = new PrismaClient();

describe('User Service', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        username: 'testuser',
        name: 'Test User'
      }
    });
    userId = user.id;
    authToken = jwt.sign({ userId: user.id }, config.jwt.secret);
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/users/profile');

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Name',
          bio: 'Updated bio'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.bio).toBe('Updated bio');
    });
  });
});