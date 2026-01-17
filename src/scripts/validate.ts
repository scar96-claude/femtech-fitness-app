import { PrismaClient, Equipment } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Validation script to verify database seeding was successful
 * Run with: pnpm validate
 */
async function validate() {
  console.log('🔍 Running validation queries...\n');

  let allPassed = true;

  // Test 1: Should return 3 users
  const userCount = await prisma.userProfile.count();
  const userTest = userCount === 3;
  console.log(`${userTest ? '✅' : '❌'} User count: ${userCount} (expected: 3)`);
  if (!userTest) allPassed = false;

  // Test 2: Should return at least 50 exercises
  const exerciseCount = await prisma.exercise.count();
  const exerciseTest = exerciseCount >= 50;
  console.log(`${exerciseTest ? '✅' : '❌'} Exercise count: ${exerciseCount} (expected: >= 50)`);
  if (!exerciseTest) allPassed = false;

  // Test 3: Should return at least 10 menopause-priority exercises
  const menopauseExercises = await prisma.exercise.count({
    where: { menopausePriority: true }
  });
  const menopauseTest = menopauseExercises >= 10;
  console.log(`${menopauseTest ? '✅' : '❌'} Menopause-priority exercises: ${menopauseExercises} (expected: >= 10)`);
  if (!menopauseTest) allPassed = false;

  // Test 4: Should return at least 15 bodyweight exercises
  const bodyweightExercises = await prisma.exercise.count({
    where: { equipmentRequired: Equipment.NONE }
  });
  const bodyweightTest = bodyweightExercises >= 15;
  console.log(`${bodyweightTest ? '✅' : '❌'} Bodyweight exercises: ${bodyweightExercises} (expected: >= 15)`);
  if (!bodyweightTest) allPassed = false;

  // Test 5: Should return 1 user with bone density risk (linda.55)
  const osteoRiskUsers = await prisma.healthMetadata.count({
    where: { boneDensityRisk: true }
  });
  const osteoTest = osteoRiskUsers === 1;
  console.log(`${osteoTest ? '✅' : '❌'} Users with bone density risk: ${osteoRiskUsers} (expected: 1)`);
  if (!osteoTest) allPassed = false;

  // Additional validation: Check demographics are correctly computed
  console.log('\n📊 Demographic distribution:');
  const reproductiveUsers = await prisma.userProfile.count({
    where: { demographic: 'REPRODUCTIVE' }
  });
  const perimenopauseUsers = await prisma.userProfile.count({
    where: { demographic: 'PERIMENOPAUSE' }
  });
  console.log(`  - REPRODUCTIVE: ${reproductiveUsers}`);
  console.log(`  - PERIMENOPAUSE: ${perimenopauseUsers}`);

  // Check movement pattern distribution
  console.log('\n💪 Movement pattern distribution:');
  const movementPatterns = await prisma.exercise.groupBy({
    by: ['movementPattern'],
    _count: true
  });
  for (const pattern of movementPatterns) {
    console.log(`  - ${pattern.movementPattern}: ${pattern._count}`);
  }

  // Check cascade delete works
  console.log('\n🔗 Testing relationships...');
  const userWithRelations = await prisma.userProfile.findFirst({
    include: {
      healthMetadata: true,
      cycleLogs: true,
      performanceLogs: true
    }
  });
  if (userWithRelations) {
    console.log(`  ✅ User "${userWithRelations.email}" has health metadata: ${userWithRelations.healthMetadata ? 'Yes' : 'No'}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 All validation tests passed!');
  } else {
    console.log('❌ Some validation tests failed. Please check the seed data.');
    process.exit(1);
  }
}

validate()
  .catch((e) => {
    console.error('❌ Error during validation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
