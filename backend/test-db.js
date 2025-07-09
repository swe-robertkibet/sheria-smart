const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
    
    // Test connection
    await prisma.$connect();
    console.log('✓ Database connection successful');
    
    // Show database info
    const dbInfo = await prisma.$queryRaw`SELECT DATABASE() as current_db`;
    console.log('Current database:', dbInfo);
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`✓ Database has ${userCount} users`);
    
    if (userCount === 0) {
      console.log('✓ Confirmed: Database is empty (0 users)');
      console.log('  This means authentication should FAIL for any existing JWTs');
    } else {
      console.log('⚠ Database has users - checking if they match any existing JWTs...');
      const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, googleId: true, createdAt: true }
      });
      console.log('Users in database:', users);
    }
    
    // Check accounts table too
    const accountCount = await prisma.account.count();
    console.log(`Database has ${accountCount} accounts`);
    
  } catch (error) {
    console.error('✗ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();