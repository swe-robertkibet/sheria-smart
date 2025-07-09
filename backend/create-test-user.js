const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      return existingUser;
    }
    
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://via.placeholder.com/150',
        googleId: 'test-google-id-123'
      }
    });
    
    console.log('Test user created successfully:', testUser);
    return testUser;
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();