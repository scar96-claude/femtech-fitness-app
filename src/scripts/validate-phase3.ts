import {
  getQuestionsForDemographic,
  processScreeningResponses,
  SCREENING_QUESTIONS,
  applySafetyFilters,
  applyPelvicFilter,
  applyBoneDensityFilter,
  applyInjuryFilter,
  Exercise,
  UserSafetyProfile,
} from '../services/safety';

/**
 * Mock exercises for testing safety filters
 * This simulates exercises from the database with varied safety flags
 */
function getMockExercises(): Exercise[] {
  return [
    // SQUAT exercises
    { id: '1', name: 'Barbell Back Squat', movementPattern: 'SQUAT', equipmentRequired: 'BARBELL', primaryMuscle: 'Quadriceps', videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: true, phaseRecommendation: 'follicular', difficulty: 'INTERMEDIATE' },
    { id: '2', name: 'Goblet Squat', movementPattern: 'SQUAT', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Quadriceps', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '3', name: 'Jump Squat', movementPattern: 'SQUAT', equipmentRequired: 'NONE', primaryMuscle: 'Quadriceps', videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'follicular', difficulty: 'INTERMEDIATE' },
    { id: '4', name: 'Wall Squat', movementPattern: 'SQUAT', equipmentRequired: 'NONE', primaryMuscle: 'Quadriceps', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '5', name: 'Bulgarian Split Squat', movementPattern: 'SQUAT', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Quadriceps', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },

    // HINGE exercises
    { id: '6', name: 'Romanian Deadlift', movementPattern: 'HINGE', equipmentRequired: 'BARBELL', primaryMuscle: 'Hamstrings', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },
    { id: '7', name: 'Conventional Deadlift', movementPattern: 'HINGE', equipmentRequired: 'BARBELL', primaryMuscle: 'Hamstrings', videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: true, phaseRecommendation: 'follicular', difficulty: 'ADVANCED' },
    { id: '8', name: 'Glute Bridge', movementPattern: 'HINGE', equipmentRequired: 'NONE', primaryMuscle: 'Glutes', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '9', name: 'Hip Thrust', movementPattern: 'HINGE', equipmentRequired: 'BARBELL', primaryMuscle: 'Glutes', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },

    // PUSH exercises
    { id: '10', name: 'Bench Press', movementPattern: 'PUSH', equipmentRequired: 'BARBELL', primaryMuscle: 'Chest', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },
    { id: '11', name: 'Overhead Press', movementPattern: 'PUSH', equipmentRequired: 'BARBELL', primaryMuscle: 'Shoulders', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },
    { id: '12', name: 'Push-Up', movementPattern: 'PUSH', equipmentRequired: 'NONE', primaryMuscle: 'Chest', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '13', name: 'Dumbbell Shoulder Press', movementPattern: 'PUSH', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Shoulders', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },

    // PULL exercises
    { id: '14', name: 'Barbell Row', movementPattern: 'PULL', equipmentRequired: 'BARBELL', primaryMuscle: 'Back', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },
    { id: '15', name: 'Lat Pulldown', movementPattern: 'PULL', equipmentRequired: 'MACHINE', primaryMuscle: 'Back', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '16', name: 'Pull-Up', movementPattern: 'PULL', equipmentRequired: 'NONE', primaryMuscle: 'Back', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'follicular', difficulty: 'ADVANCED' },
    { id: '17', name: 'Dumbbell Row', movementPattern: 'PULL', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Back', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },

    // CARRY exercises
    { id: '18', name: 'Farmer Walk', movementPattern: 'CARRY', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '19', name: 'Suitcase Carry', movementPattern: 'CARRY', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '20', name: 'Overhead Carry', movementPattern: 'CARRY', equipmentRequired: 'DUMBBELLS', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: true, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },

    // CORE exercises - includes some unsafe ones
    { id: '21', name: 'Plank', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '22', name: 'Dead Bug', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '23', name: 'Bird Dog', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '24', name: 'Sit-Up', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: false, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '25', name: 'Crunch', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: false, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '26', name: 'Russian Twist', movementPattern: 'CORE', equipmentRequired: 'NONE', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: false, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'INTERMEDIATE' },
    { id: '27', name: 'Pallof Press', movementPattern: 'CORE', equipmentRequired: 'BANDS', primaryMuscle: 'Core', videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },

    // CARDIO exercises
    { id: '28', name: 'Walking', movementPattern: 'CARDIO', equipmentRequired: 'NONE', primaryMuscle: null, videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '29', name: 'Cycling', movementPattern: 'CARDIO', equipmentRequired: 'MACHINE', primaryMuscle: null, videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
    { id: '30', name: 'Burpee', movementPattern: 'CARDIO', equipmentRequired: 'NONE', primaryMuscle: null, videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'follicular', difficulty: 'ADVANCED' },
    { id: '31', name: 'Box Jump', movementPattern: 'CARDIO', equipmentRequired: 'NONE', primaryMuscle: null, videoUrl: null, isOsteoSafe: true, isPelvicSafe: false, menopausePriority: false, phaseRecommendation: 'follicular', difficulty: 'INTERMEDIATE' },
    { id: '32', name: 'Rowing Machine', movementPattern: 'CARDIO', equipmentRequired: 'MACHINE', primaryMuscle: null, videoUrl: null, isOsteoSafe: true, isPelvicSafe: true, menopausePriority: false, phaseRecommendation: 'all', difficulty: 'BEGINNER' },
  ];
}

/**
 * Phase 3 Validation Script
 * Tests the safety layer components
 */
async function validatePhase3() {
  console.log('=== Phase 3 Safety Layer Validation ===\n');

  let allPassed = true;

  // ============================================================
  // Test 1: Screening Questions Load Correctly
  // ============================================================
  console.log('Test 1: Screening Questions');

  const reproQuestions = getQuestionsForDemographic('reproductive');
  const periQuestions = getQuestionsForDemographic('perimenopause');

  console.log(`  Total questions: ${SCREENING_QUESTIONS.length}`);
  console.log(`  Reproductive demographic: ${reproQuestions.length} questions`);
  console.log(`  Perimenopause demographic: ${periQuestions.length} questions`);

  // Reproductive gets: 4 pelvic (all) + 1 pelvic (reproductive) + 3 bone (all) = 8
  const reproTest = reproQuestions.length === 8;
  console.log(`  Reproductive count ${reproTest ? '✅' : '❌ (expected: 8)'}`);
  if (!reproTest) allPassed = false;

  // Perimenopause gets: 4 pelvic (all) + 3 bone (all) + 1 bone (perimenopause) = 8
  const periTest = periQuestions.length === 8;
  console.log(`  Perimenopause count ${periTest ? '✅' : '❌ (expected: 8)'}`);
  if (!periTest) allPassed = false;

  // Verify different questions for each demographic
  const reproHasPelvic5 = reproQuestions.some(q => q.id === 'pelvic-5');
  const periHasBone3 = periQuestions.some(q => q.id === 'bone-3');
  console.log(`  Reproductive has pelvic-5 (recent birth): ${reproHasPelvic5 ? '✅' : '❌'}`);
  console.log(`  Perimenopause has bone-3 (family history): ${periHasBone3 ? '✅' : '❌'}`);
  if (!reproHasPelvic5) allPassed = false;
  if (!periHasBone3) allPassed = false;

  console.log('');

  // ============================================================
  // Test 2: Screening Response Processing
  // ============================================================
  console.log('Test 2: Screening Response Processing');

  // Test with pelvic risk trigger
  const pelvicResponses = [
    { questionId: 'pelvic-1', answer: true },
    { questionId: 'pelvic-2', answer: false },
    { questionId: 'bone-1', answer: false },
  ];
  const pelvicResult = processScreeningResponses(pelvicResponses);
  const pelvicOnlyTest = pelvicResult.pelvicRisk === true && pelvicResult.boneDensityRisk === false;
  console.log(`  Pelvic-only response: pelvicRisk=${pelvicResult.pelvicRisk}, boneDensityRisk=${pelvicResult.boneDensityRisk} ${pelvicOnlyTest ? '✅' : '❌'}`);
  if (!pelvicOnlyTest) allPassed = false;

  // Test with bone risk trigger
  const boneResponses = [
    { questionId: 'pelvic-1', answer: false },
    { questionId: 'bone-1', answer: true },
    { questionId: 'bone-2', answer: false },
  ];
  const boneResult = processScreeningResponses(boneResponses);
  const boneOnlyTest = boneResult.pelvicRisk === false && boneResult.boneDensityRisk === true;
  console.log(`  Bone-only response: pelvicRisk=${boneResult.pelvicRisk}, boneDensityRisk=${boneResult.boneDensityRisk} ${boneOnlyTest ? '✅' : '❌'}`);
  if (!boneOnlyTest) allPassed = false;

  // Test with both triggers
  const bothResponses = [
    { questionId: 'pelvic-1', answer: true },
    { questionId: 'bone-1', answer: true },
  ];
  const bothResult = processScreeningResponses(bothResponses);
  const bothTest = bothResult.pelvicRisk === true && bothResult.boneDensityRisk === true;
  console.log(`  Both risks response: pelvicRisk=${bothResult.pelvicRisk}, boneDensityRisk=${bothResult.boneDensityRisk} ${bothTest ? '✅' : '❌'}`);
  if (!bothTest) allPassed = false;

  // Test flagged questions
  const flaggedTest = bothResult.flaggedQuestions.length === 2 &&
    bothResult.flaggedQuestions.includes('pelvic-1') &&
    bothResult.flaggedQuestions.includes('bone-1');
  console.log(`  Flagged questions tracked: ${flaggedTest ? '✅' : '❌'}`);
  if (!flaggedTest) allPassed = false;

  // Test no risk when all answers are false
  const noRiskResponses = [
    { questionId: 'pelvic-1', answer: false },
    { questionId: 'bone-1', answer: false },
  ];
  const noRiskResult = processScreeningResponses(noRiskResponses);
  const noRiskTest = noRiskResult.pelvicRisk === false && noRiskResult.boneDensityRisk === false;
  console.log(`  No risk when all false: ${noRiskTest ? '✅' : '❌'}`);
  if (!noRiskTest) allPassed = false;

  console.log('');

  // ============================================================
  // Test 3: Pelvic Floor Filter
  // ============================================================
  console.log('Test 3: Pelvic Floor Filter');

  const allExercises = getMockExercises();
  console.log(`  Total mock exercises: ${allExercises.length}`);

  const pelvicFilterResult = applyPelvicFilter(allExercises, true);
  console.log(`  After pelvic filter: ${pelvicFilterResult.filtered.length}`);
  console.log(`  Removed: ${allExercises.length - pelvicFilterResult.filtered.length}`);

  // Check no jump exercises remain
  const jumpExercises = pelvicFilterResult.filtered.filter((e: Exercise) =>
    e.name.toLowerCase().includes('jump')
  );
  const jumpTest = jumpExercises.length === 0;
  console.log(`  Jump exercises remaining: ${jumpExercises.length} ${jumpTest ? '✅' : '❌ (expected: 0)'}`);
  if (!jumpTest) allPassed = false;

  // Check no burpee exercises remain
  const burpeeExercises = pelvicFilterResult.filtered.filter((e: Exercise) =>
    e.name.toLowerCase().includes('burpee')
  );
  const burpeeTest = burpeeExercises.length === 0;
  console.log(`  Burpee exercises remaining: ${burpeeExercises.length} ${burpeeTest ? '✅' : '❌ (expected: 0)'}`);
  if (!burpeeTest) allPassed = false;

  // Verify pelvicRisk=false returns all exercises
  const noPelvicRisk = applyPelvicFilter(allExercises, false);
  const noPelvicTest = noPelvicRisk.filtered.length === allExercises.length;
  console.log(`  No pelvic risk = no filtering: ${noPelvicTest ? '✅' : '❌'}`);
  if (!noPelvicTest) allPassed = false;

  console.log('');

  // ============================================================
  // Test 4: Bone Density Filter
  // ============================================================
  console.log('Test 4: Bone Density Filter');

  const boneFilterResult = applyBoneDensityFilter(allExercises, true);
  console.log(`  After bone density filter: ${boneFilterResult.filtered.length}`);
  console.log(`  Removed: ${allExercises.length - boneFilterResult.filtered.length}`);

  // Check no spinal flexion exercises remain (crunch, sit-up, russian twist)
  const spinalFlexion = boneFilterResult.filtered.filter((e: Exercise) =>
    e.name.toLowerCase().includes('crunch') ||
    e.name.toLowerCase().includes('sit-up') ||
    e.name.toLowerCase().includes('russian twist')
  );
  const spinalTest = spinalFlexion.length === 0;
  console.log(`  Spinal flexion exercises remaining: ${spinalFlexion.length} ${spinalTest ? '✅' : '❌ (expected: 0)'}`);
  if (!spinalTest) allPassed = false;

  // Verify boneDensityRisk=false returns all exercises
  const noBoneRisk = applyBoneDensityFilter(allExercises, false);
  const noBoneTest = noBoneRisk.filtered.length === allExercises.length;
  console.log(`  No bone risk = no filtering: ${noBoneTest ? '✅' : '❌'}`);
  if (!noBoneTest) allPassed = false;

  console.log('');

  // ============================================================
  // Test 5: Combined Filters (Pelvic + Bone)
  // ============================================================
  console.log('Test 5: Combined Filters (Pelvic + Bone)');

  const combinedProfile: UserSafetyProfile = {
    pelvicRisk: true,
    boneDensityRisk: true,
    injuries: [],
  };

  const combinedResult = await applySafetyFilters(allExercises, combinedProfile);
  console.log(`  After combined filters: ${combinedResult.filteredExercises.length}`);
  console.log(`  Total removed: ${combinedResult.removedCount}`);

  // Combined should remove more than either alone
  const pelvicRemoved = allExercises.length - pelvicFilterResult.filtered.length;
  const boneRemoved = allExercises.length - boneFilterResult.filtered.length;
  const combinedTest = combinedResult.removedCount >= Math.max(pelvicRemoved, boneRemoved);
  console.log(`  Combined removes >= individual: ${combinedTest ? '✅' : '❌'}`);
  if (!combinedTest) allPassed = false;

  // Check warnings are generated
  const hasWarnings = combinedResult.warnings.length >= 2;
  console.log(`  Warnings generated: ${combinedResult.warnings.length} ${hasWarnings ? '✅' : '❌'}`);
  if (!hasWarnings) allPassed = false;
  combinedResult.warnings.forEach((w: string) => console.log(`    - ${w}`));

  console.log('');

  // ============================================================
  // Test 6: Safety Flag Counts
  // ============================================================
  console.log('Test 6: Safety Flag Counts');

  const pelvicUnsafeCount = allExercises.filter(e => !e.isPelvicSafe).length;
  const osteoUnsafeCount = allExercises.filter(e => !e.isOsteoSafe).length;

  console.log(`  Exercises with isPelvicSafe=false: ${pelvicUnsafeCount}`);
  console.log(`  Exercises with isOsteoSafe=false: ${osteoUnsafeCount}`);

  // Verify filter removal count matches flags
  const pelvicRemovedCount = allExercises.length - pelvicFilterResult.filtered.length;
  const pelvicFlagMatch = pelvicRemovedCount === pelvicUnsafeCount;
  console.log(`  Pelvic filter removal matches flags: ${pelvicRemovedCount} = ${pelvicUnsafeCount} ${pelvicFlagMatch ? '✅' : '❌'}`);
  if (!pelvicFlagMatch) allPassed = false;

  const boneRemovedCount = allExercises.length - boneFilterResult.filtered.length;
  const boneFlagMatch = boneRemovedCount === osteoUnsafeCount;
  console.log(`  Bone filter removal matches flags: ${boneRemovedCount} = ${osteoUnsafeCount} ${boneFlagMatch ? '✅' : '❌'}`);
  if (!boneFlagMatch) allPassed = false;

  console.log('');

  // ============================================================
  // Test 7: Movement Pattern Coverage After Filtering
  // ============================================================
  console.log('Test 7: Movement Pattern Coverage');

  const patterns = ['SQUAT', 'HINGE', 'PUSH', 'PULL', 'CARRY', 'CORE', 'CARDIO'];
  let coverageWarnings = 0;

  for (const pattern of patterns) {
    const countBefore = allExercises.filter((e: Exercise) => e.movementPattern === pattern).length;
    const countAfter = combinedResult.filteredExercises.filter((e: Exercise) => e.movementPattern === pattern).length;
    const status = countAfter >= 2 ? '✅' : '⚠️';
    if (countAfter < 2) coverageWarnings++;
    console.log(`  ${pattern}: ${countBefore} → ${countAfter} ${status}`);
  }

  console.log(`  Coverage warnings: ${coverageWarnings} ${coverageWarnings <= 2 ? '✅' : '❌'}`);
  if (coverageWarnings > 2) allPassed = false;

  console.log('');

  // ============================================================
  // Test 8: Injury Filter
  // ============================================================
  console.log('Test 8: Injury Filter');

  const injuryProfile: UserSafetyProfile = {
    pelvicRisk: false,
    boneDensityRisk: false,
    injuries: [
      { type: 'strain', bodyPart: 'knee', date: '2025-01-01' },
    ],
  };

  const injuryResult = await applySafetyFilters(allExercises, injuryProfile);

  // Knee injury should filter out SQUAT pattern exercises
  const squatBefore = allExercises.filter((e: Exercise) => e.movementPattern === 'SQUAT').length;
  const squatAfter = injuryResult.filteredExercises.filter((e: Exercise) => e.movementPattern === 'SQUAT').length;

  const injuryFilterWorks = squatAfter < squatBefore;
  console.log(`  Knee injury SQUAT exercises: ${squatBefore} → ${squatAfter} ${injuryFilterWorks ? '✅' : '❌'}`);
  if (!injuryFilterWorks) allPassed = false;

  // Test shoulder injury filters PUSH
  const shoulderProfile: UserSafetyProfile = {
    pelvicRisk: false,
    boneDensityRisk: false,
    injuries: [
      { type: 'strain', bodyPart: 'shoulder', date: '2025-01-01' },
    ],
  };

  const shoulderResult = await applySafetyFilters(allExercises, shoulderProfile);
  const pushBefore = allExercises.filter((e: Exercise) => e.movementPattern === 'PUSH').length;
  const pushAfter = shoulderResult.filteredExercises.filter((e: Exercise) => e.movementPattern === 'PUSH').length;

  const shoulderFilterWorks = pushAfter < pushBefore;
  console.log(`  Shoulder injury PUSH exercises: ${pushBefore} → ${pushAfter} ${shoulderFilterWorks ? '✅' : '❌'}`);
  if (!shoulderFilterWorks) allPassed = false;

  // Test lower back injury filters HINGE
  const backProfile: UserSafetyProfile = {
    pelvicRisk: false,
    boneDensityRisk: false,
    injuries: [
      { type: 'strain', bodyPart: 'lower back', date: '2025-01-01' },
    ],
  };

  const backResult = await applySafetyFilters(allExercises, backProfile);
  const hingeBefore = allExercises.filter((e: Exercise) => e.movementPattern === 'HINGE').length;
  const hingeAfter = backResult.filteredExercises.filter((e: Exercise) => e.movementPattern === 'HINGE').length;

  const backFilterWorks = hingeAfter < hingeBefore;
  console.log(`  Lower back injury HINGE exercises: ${hingeBefore} → ${hingeAfter} ${backFilterWorks ? '✅' : '❌'}`);
  if (!backFilterWorks) allPassed = false;

  console.log('');

  // ============================================================
  // Test 9: No Injuries = No Filtering
  // ============================================================
  console.log('Test 9: No Risk Profile = No Filtering');

  const noRiskProfile: UserSafetyProfile = {
    pelvicRisk: false,
    boneDensityRisk: false,
    injuries: [],
  };

  const noRiskFilterResult = await applySafetyFilters(allExercises, noRiskProfile);
  const noFilteringTest = noRiskFilterResult.filteredExercises.length === allExercises.length;
  console.log(`  No risks: ${allExercises.length} → ${noRiskFilterResult.filteredExercises.length} ${noFilteringTest ? '✅' : '❌'}`);
  if (!noFilteringTest) allPassed = false;

  const noSubstitutionsTest = noRiskFilterResult.substitutions.length === 0;
  console.log(`  No substitutions offered: ${noSubstitutionsTest ? '✅' : '❌'}`);
  if (!noSubstitutionsTest) allPassed = false;

  console.log('');

  // ============================================================
  // Test 10: Specific Exercise Filtering
  // ============================================================
  console.log('Test 10: Specific Exercise Filtering');

  // Test specific exercises that should be filtered
  const pelvicFiltered = pelvicFilterResult.filtered;

  // Barbell Back Squat (isPelvicSafe: false) should be removed
  const backSquatRemoved = !pelvicFiltered.some(e => e.name === 'Barbell Back Squat');
  console.log(`  Barbell Back Squat removed (pelvic): ${backSquatRemoved ? '✅' : '❌'}`);
  if (!backSquatRemoved) allPassed = false;

  // Goblet Squat (isPelvicSafe: true) should remain
  const gobletSquatRemains = pelvicFiltered.some(e => e.name === 'Goblet Squat');
  console.log(`  Goblet Squat remains (pelvic safe): ${gobletSquatRemains ? '✅' : '❌'}`);
  if (!gobletSquatRemains) allPassed = false;

  const boneFiltered = boneFilterResult.filtered;

  // Sit-Up (isOsteoSafe: false) should be removed
  const sitUpRemoved = !boneFiltered.some(e => e.name === 'Sit-Up');
  console.log(`  Sit-Up removed (bone): ${sitUpRemoved ? '✅' : '❌'}`);
  if (!sitUpRemoved) allPassed = false;

  // Hip Thrust (isOsteoSafe: true) should remain
  const hipThrustRemains = boneFiltered.some(e => e.name === 'Hip Thrust');
  console.log(`  Hip Thrust remains (osteo safe): ${hipThrustRemains ? '✅' : '❌'}`);
  if (!hipThrustRemains) allPassed = false;

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log('='.repeat(50));
  if (allPassed) {
    console.log('All Phase 3 Validations Passed!');
  } else {
    console.log('Some Phase 3 validations failed. Please check the output above.');
    process.exit(1);
  }
}

validatePhase3().catch((e) => {
  console.error('Error during validation:', e);
  process.exit(1);
});
