
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clean up database before tests
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.like.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
