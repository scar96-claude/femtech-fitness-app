import { create } from 'zustand';

interface CycleData {
  lastPeriodDate: Date | null;
  cycleLength: number;
  regularity: 'regular' | 'irregular' | 'unknown' | null;
}

interface HealthScreening {
  pelvicFloorIssues: boolean;
  diastasisRecti: boolean;
  recentPregnancy: boolean;
  osteoporosisRisk: boolean;
  jointIssues: boolean;
  backProblems: boolean;
  cardiovascularConditions: boolean;
}

interface OnboardingData {
  // Screen 1: Age
  dateOfBirth: Date | null;

  // Screen 2: Metrics
  heightCm: number | null;
  weightKg: number | null;

  // Screen 3: Activity
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | null;

  // Screen 4: Goal
  primaryGoal: 'strength' | 'weight_loss' | 'endurance' | 'bone_health' | null;

  // Screen 5: Equipment
  equipmentAccess: 'bodyweight' | 'home_gym' | 'full_gym' | null;

  // Screen 6: Frequency
  workoutFrequency: number;
  includeCardio: boolean;

  // Screen 7: Health Screening
  healthScreening: HealthScreening;

  // Screen 8: Cycle (only for reproductive demographic)
  cycleData: CycleData;
}

interface OnboardingState extends OnboardingData {
  currentStep: number;
  totalSteps: number;

  // Computed
  demographic: 'reproductive' | 'perimenopause' | null;

  // Actions
  setDateOfBirth: (date: Date) => void;
  setMetrics: (height: number, weight: number) => void;
  setActivityLevel: (level: OnboardingData['activityLevel']) => void;
  setPrimaryGoal: (goal: OnboardingData['primaryGoal']) => void;
  setEquipmentAccess: (equipment: OnboardingData['equipmentAccess']) => void;
  setWorkoutFrequency: (frequency: number) => void;
  setIncludeCardio: (include: boolean) => void;
  setHealthScreening: (key: keyof HealthScreening, value: boolean) => void;
  setCycleData: (data: Partial<CycleData>) => void;

  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  // Get all data for submission
  getData: () => OnboardingData;
}

const initialHealthScreening: HealthScreening = {
  pelvicFloorIssues: false,
  diastasisRecti: false,
  recentPregnancy: false,
  osteoporosisRisk: false,
  jointIssues: false,
  backProblems: false,
  cardiovascularConditions: false,
};

const initialCycleData: CycleData = {
  lastPeriodDate: null,
  cycleLength: 28,
  regularity: null,
};

const initialState: OnboardingData = {
  dateOfBirth: null,
  heightCm: null,
  weightKg: null,
  activityLevel: null,
  primaryGoal: null,
  equipmentAccess: null,
  workoutFrequency: 3,
  includeCardio: true,
  healthScreening: initialHealthScreening,
  cycleData: initialCycleData,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  currentStep: 1,
  totalSteps: 8, // Will be 7 for perimenopause users
  demographic: null,

  setDateOfBirth: (date) => {
    const age = Math.floor(
      (Date.now() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const demographic = age < 40 ? 'reproductive' : 'perimenopause';
    const totalSteps = demographic === 'reproductive' ? 8 : 7;

    set({ dateOfBirth: date, demographic, totalSteps });
  },

  setMetrics: (height, weight) => {
    set({ heightCm: height, weightKg: weight });
  },

  setActivityLevel: (level) => {
    set({ activityLevel: level });
  },

  setPrimaryGoal: (goal) => {
    set({ primaryGoal: goal });
  },

  setEquipmentAccess: (equipment) => {
    set({ equipmentAccess: equipment });
  },

  setWorkoutFrequency: (frequency) => {
    set({ workoutFrequency: frequency });
  },

  setIncludeCardio: (include) => {
    set({ includeCardio: include });
  },

  setHealthScreening: (key, value) => {
    set((state) => ({
      healthScreening: {
        ...state.healthScreening,
        [key]: value,
      },
    }));
  },

  setCycleData: (data) => {
    set((state) => ({
      cycleData: {
        ...state.cycleData,
        ...data,
      },
    }));
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  reset: () =>
    set({ ...initialState, currentStep: 1, totalSteps: 8, demographic: null }),

  getData: () => {
    const state = get();
    return {
      dateOfBirth: state.dateOfBirth,
      heightCm: state.heightCm,
      weightKg: state.weightKg,
      activityLevel: state.activityLevel,
      primaryGoal: state.primaryGoal,
      equipmentAccess: state.equipmentAccess,
      workoutFrequency: state.workoutFrequency,
      includeCardio: state.includeCardio,
      healthScreening: state.healthScreening,
      cycleData: state.cycleData,
    };
  },
}));
