import prisma from './lib/prisma';

/**
 * FemTech Fitness App
 * A women's fitness application with cycle-aware workout recommendations
 */
async function main() {
  console.log('FemTech Fitness App');
  console.log('==================\n');

  // Test database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    const userCount = await prisma.userProfile.count();
    const exerciseCount = await prisma.exercise.count();

    console.log(`\nDatabase stats:`);
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Exercises: ${exerciseCount}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
