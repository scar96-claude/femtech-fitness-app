import { PrismaClient, Demographic, ActivityLevel, Goal, CycleType, MovementPattern, Equipment, Phase, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate demographic based on date of birth
 * Age < 40 = REPRODUCTIVE, Age >= 40 = PERIMENOPAUSE
 */
function calculateDemographic(dateOfBirth: Date): Demographic {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age < 40 ? Demographic.REPRODUCTIVE : Demographic.PERIMENOPAUSE;
}

// ============================================================================
// EXERCISE DATA (50+ exercises)
// ============================================================================

interface ExerciseData {
  name: string;
  movementPattern: MovementPattern;
  equipmentRequired: Equipment;
  primaryMuscle: string;
  isOsteoSafe: boolean;
  isPelvicSafe: boolean;
  menopausePriority: boolean;
  phaseRecommendation: Phase;
  difficulty: Difficulty;
}

const exercises: ExerciseData[] = [
  // ============ SQUAT MOVEMENTS (8 exercises) ============
  {
    name: "Barbell Back Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: false, // High intra-abdominal pressure
    menopausePriority: true, // Heavy axial loading
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Goblet Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Bulgarian Split Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Wall Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Air Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Jump Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: false, // High impact
    isPelvicSafe: false, // High impact
    menopausePriority: false,
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Box Squat",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: false,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Leg Press",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ HINGE MOVEMENTS (8 exercises) ============
  {
    name: "Deadlift",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Hamstrings",
    isOsteoSafe: true,
    isPelvicSafe: false, // High intra-abdominal pressure
    menopausePriority: true, // Heavy axial loading
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Romanian Deadlift",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Hamstrings",
    isOsteoSafe: true,
    isPelvicSafe: false,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Hip Thrust",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Glutes",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Glute Bridge",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Glutes",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Single-Leg RDL",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Hamstrings",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Good Morning",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Hamstrings",
    isOsteoSafe: true,
    isPelvicSafe: false,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Kettlebell Swing",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.DUMBBELLS, // Kettlebell classified under dumbbells
    primaryMuscle: "Glutes",
    isOsteoSafe: true,
    isPelvicSafe: false,
    menopausePriority: true,
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Cable Pull-Through",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Glutes",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ PUSH MOVEMENTS (8 exercises) ============
  {
    name: "Bench Press",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Chest",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Overhead Press",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true, // Heavy axial loading
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Push-Up",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Chest",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Incline Dumbbell Press",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Chest",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Pike Push-Up",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Dips",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Triceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Landmine Press",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Dumbbell Shoulder Press",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ PULL MOVEMENTS (8 exercises) ============
  {
    name: "Bent Over Row",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Back",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Lat Pulldown",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Lats",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Face Pull",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.BANDS,
    primaryMuscle: "Rear Delts",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Single-Arm Dumbbell Row",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Back",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Pull-Up",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Lats",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: "Seated Cable Row",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Back",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "T-Bar Row",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Back",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Band Pull-Apart",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.BANDS,
    primaryMuscle: "Rear Delts",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ CARRY MOVEMENTS (6 exercises) ============
  {
    name: "Farmer's Walk",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Grip",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true, // Axial loading + impact
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Suitcase Carry",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Obliques",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Overhead Carry",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Waiter Walk",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Front Rack Carry",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Trap Bar Carry",
    movementPattern: MovementPattern.CARRY,
    equipmentRequired: Equipment.BARBELL,
    primaryMuscle: "Grip",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ CORE MOVEMENTS (8 exercises) ============
  {
    name: "Plank",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: false, // Direct core pressure
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Dead Bug",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Bird Dog",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Pallof Press",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.BANDS,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Ab Wheel",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: false, // High intra-abdominal pressure
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.ADVANCED
  },
  {
    name: "Hollow Hold",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: false, // Core pressure
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Sit-Up",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: false, // Deep spinal flexion
    isPelvicSafe: false, // Direct core pressure
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Russian Twist",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Obliques",
    isOsteoSafe: false, // Loaded rotation
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ CARDIO MOVEMENTS (8 exercises) ============
  {
    name: "Battle Ropes",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Sled Push",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Legs",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: "Rowing Machine",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Back",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Assault Bike",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Legs",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Jump Rope",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Calves",
    isOsteoSafe: false, // High impact
    isPelvicSafe: false, // High impact
    menopausePriority: false,
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Heel Drops",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Calves",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true, // Impact exercise for bone health
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Step-Ups",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true, // Impact exercise
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Walking Lunges",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },

  // ============ ADDITIONAL EXERCISES TO REACH 50+ ============
  {
    name: "Leg Curl",
    movementPattern: MovementPattern.HINGE,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Hamstrings",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Leg Extension",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Quadriceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Calf Raise",
    movementPattern: MovementPattern.SQUAT,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Calves",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: true,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Chest Fly",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Chest",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Tricep Pushdown",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.MACHINE,
    primaryMuscle: "Triceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Bicep Curl",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Biceps",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Lateral Raise",
    movementPattern: MovementPattern.PUSH,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Shoulders",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Reverse Fly",
    movementPattern: MovementPattern.PULL,
    equipmentRequired: Equipment.DUMBBELLS,
    primaryMuscle: "Rear Delts",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Side Plank",
    movementPattern: MovementPattern.CORE,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Obliques",
    isOsteoSafe: true,
    isPelvicSafe: true,
    menopausePriority: false,
    phaseRecommendation: Phase.ANY,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: "Mountain Climbers",
    movementPattern: MovementPattern.CARDIO,
    equipmentRequired: Equipment.NONE,
    primaryMuscle: "Core",
    isOsteoSafe: true,
    isPelvicSafe: false, // High intensity core engagement
    menopausePriority: false,
    phaseRecommendation: Phase.FOLLICULAR,
    difficulty: Difficulty.INTERMEDIATE
  }
];

// ============================================================================
// TEST USER DATA
// ============================================================================

interface TestUserData {
  email: string;
  dateOfBirth: Date;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  primaryGoal: Goal;
  healthMetadata: {
    pelvicRisk: boolean;
    boneDensityRisk: boolean;
    cycleType: CycleType;
    lastPeriodDate: Date | null;
    avgCycleLength: number;
  };
}

const testUsers: TestUserData[] = [
  {
    email: "sarah.28@test.com",
    dateOfBirth: new Date("1998-03-15"), // Age 28 → REPRODUCTIVE
    heightCm: 165,
    weightKg: 62,
    activityLevel: ActivityLevel.MODERATE,
    primaryGoal: Goal.STRENGTH,
    healthMetadata: {
      pelvicRisk: false,
      boneDensityRisk: false,
      cycleType: CycleType.REGULAR,
      lastPeriodDate: new Date("2026-01-05"),
      avgCycleLength: 28
    }
  },
  {
    email: "maria.45@test.com",
    dateOfBirth: new Date("1981-07-22"), // Age 45 → PERIMENOPAUSE
    heightCm: 168,
    weightKg: 71,
    activityLevel: ActivityLevel.LIGHT,
    primaryGoal: Goal.BONE_HEALTH,
    healthMetadata: {
      pelvicRisk: true,
      boneDensityRisk: false,
      cycleType: CycleType.PERIMENOPAUSE,
      lastPeriodDate: new Date("2025-12-10"),
      avgCycleLength: 35
    }
  },
  {
    email: "linda.55@test.com",
    dateOfBirth: new Date("1971-01-08"), // Age 55 → PERIMENOPAUSE
    heightCm: 162,
    weightKg: 68,
    activityLevel: ActivityLevel.MODERATE,
    primaryGoal: Goal.BONE_HEALTH,
    healthMetadata: {
      pelvicRisk: false,
      boneDensityRisk: true,
      cycleType: CycleType.POSTMENOPAUSE,
      lastPeriodDate: null,
      avgCycleLength: 28
    }
  }
];

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('🌱 Starting database seeding...\n');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.performanceLog.deleteMany();
  await prisma.cycleLog.deleteMany();
  await prisma.healthMetadata.deleteMany();
  await prisma.workoutTemplate.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.exercise.deleteMany();

  // Seed exercises
  console.log(`\n💪 Seeding ${exercises.length} exercises...`);
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise
    });
  }
  console.log(`✅ Created ${exercises.length} exercises`);

  // Seed test users with their health metadata
  console.log(`\n👤 Seeding ${testUsers.length} test users...`);
  for (const userData of testUsers) {
    const demographic = calculateDemographic(userData.dateOfBirth);

    await prisma.userProfile.create({
      data: {
        email: userData.email,
        dateOfBirth: userData.dateOfBirth,
        heightCm: userData.heightCm,
        weightKg: userData.weightKg,
        activityLevel: userData.activityLevel,
        primaryGoal: userData.primaryGoal,
        demographic: demographic,
        healthMetadata: {
          create: {
            pelvicRisk: userData.healthMetadata.pelvicRisk,
            boneDensityRisk: userData.healthMetadata.boneDensityRisk,
            cycleType: userData.healthMetadata.cycleType,
            lastPeriodDate: userData.healthMetadata.lastPeriodDate,
            avgCycleLength: userData.healthMetadata.avgCycleLength,
            injuryHistory: [],
            medications: []
          }
        }
      }
    });
    console.log(`  ✅ Created user: ${userData.email} (${demographic})`);
  }

  // Print summary statistics
  console.log('\n📊 Seed Summary:');
  const userCount = await prisma.userProfile.count();
  const exerciseCount = await prisma.exercise.count();
  const menopauseExercises = await prisma.exercise.count({
    where: { menopausePriority: true }
  });
  const bodyweightExercises = await prisma.exercise.count({
    where: { equipmentRequired: Equipment.NONE }
  });
  const osteoRiskUsers = await prisma.healthMetadata.count({
    where: { boneDensityRisk: true }
  });

  console.log(`  - Users: ${userCount}`);
  console.log(`  - Exercises: ${exerciseCount}`);
  console.log(`  - Menopause-priority exercises: ${menopauseExercises}`);
  console.log(`  - Bodyweight exercises: ${bodyweightExercises}`);
  console.log(`  - Users with bone density risk: ${osteoRiskUsers}`);

  console.log('\n🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
