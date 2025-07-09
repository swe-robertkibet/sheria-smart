const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    
    const users = await prisma.user.findMany({
      take: 10
    });
    
    console.log('Users found:', users.length);
    console.log('Users:', users);
    
    if (users.length === 0) {
      console.log('No users found in database!');
      console.log('This explains the foreign key constraint error.');
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();