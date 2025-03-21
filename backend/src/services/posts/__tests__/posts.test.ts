import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
import express from 'express';
import postRoutes from '../index';
import { authenticateToken } from '../../../middleware/auth';
import {describe, expect} from '@jest/globals';

const app = express();
app.use(express.json());
app.use(authenticateToken);
app.use('/api/posts', postRoutes);

const prisma = new PrismaClient();

const generateUniqueEmail = () => `test_${Date.now()}@example.com`;

describe('Post Service', () => {
  let authToken: string;
  let userId: string;
  let postId: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();

    const email = generateUniqueEmail();
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    
    if (existingUser) {
      console.log('User with this email already exists');
      userId = existingUser.id;
    }else{
      const user = await prisma.user.create({
        data: {
          email,
          password: 'hashedpassword',
          username: 'testuser',
          name: 'Test User'
        }
      });
      userId = user.id;
    }
    const post = await prisma.post.create({
      data: {
        content: 'Test post content',
        authorId: userId
      }
    });
    postId = post.id;

    
    authToken = jwt.sign({ userId }, config.jwt.secret);
  });

  describe('POST /api/posts', () => {
    it('should create a post successfully', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Test post content'
        });

      expect(response.status).toBe(201);
      expect(response.body.content).toBe('Test post content');
      expect(response.body.authorId).toBe(userId);
      
    });

    it('should return 400 for empty content', async () => {
      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: ''
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts with pagination', async () => {
      const response = await request(app)
        .get('/api/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.posts)).toBe(true);
    });
  });

  describe('PUT /api/posts/:postId', () => {
    it('should update a post successfully', async () => {
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Updated content'
        });

      expect(response.status).toBe(200);
      expect(response.body.content).toBe('Updated content');
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .put('/api/posts/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Updated content'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/posts/:postId/like', () => {
    it('should like a post successfully', async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post liked');
    });

    it('should unlike a previously liked post', async () => {
      const response = await request(app)
        .post(`/api/posts/${postId}/like`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Post unliked');
    });
  });
});