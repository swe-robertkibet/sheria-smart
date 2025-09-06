import prisma from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding admin user...');

  // Update the admin user if they exist, or create them if they don't
  const adminEmail = 'swe.robertkibet@gmail.com';
  
  try {
    // First, try to find the user
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingUser) {
      // Update existing user to be admin
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { isAdmin: true }
      });
      
      console.log(`✅ Updated existing user ${adminEmail} to admin status`);
      console.log(`   User ID: ${updatedUser.id}`);
      console.log(`   Name: ${updatedUser.name || 'Not set'}`);
      console.log(`   Admin: ${updatedUser.isAdmin}`);
    } else {
      console.log(`⚠️  User ${adminEmail} not found in database`);
      console.log('   The admin user will be created automatically when they first log in via Google OAuth');
      console.log('   After first login, you can run this seed script again to grant admin privileges');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    throw error;
  }

  console.log('🌱 Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });