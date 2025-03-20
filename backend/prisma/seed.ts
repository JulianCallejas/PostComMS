import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const password = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'jc@example.com' },
      update: {},
      create: {
        email: 'jc@example.com',
        username: 'johnc',
        name: 'John Connor',
        password,
        bio: 'Leader of the worldwide human Resistance'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sc@example.com' },
      update: {},
      create: {
        email: 'sc@example.com',
        username: 'sarahc',
        name: 'Sarah Connor',
        password,
        bio: 'Worldwide human Resistance founder'
      }
    })
  ]);

  // Create some posts
  await Promise.all([
    prisma.post.create({
      data: {
        content: 'Hello world! This is my first post against Skynet',
        authorId: users[0].id
      }
    }),
    prisma.post.create({
      data: {
        content: 'Excited to join this platform! and start the Resistance',
        authorId: users[1].id
      }
    })
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    //process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });