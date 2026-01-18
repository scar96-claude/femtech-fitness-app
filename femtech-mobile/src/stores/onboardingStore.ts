import { create } from 'zustand';

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
  equipment: 'bodyweight' | 'home_gym' | 'full_gym' | null;

  // Screen 6: Frequency
  frequencyPerWeek: number;
  includeCardio: boolean;

  // Screen 7: Health Screening
  healthResponses: {
    questionId: string;
    answer: boolean;
  }[];

  // Screen 8: Cycle (only for reproductive demographic)
  lastPeriodDate: Date | null;
  avgCycleLength: number;
  cycleType: 'regular' | 'irregular' | null;
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
  setEquipment: (equipment: OnboardingData['equipment']) => void;
  setFrequency: (frequency: number, cardio: boolean) => void;
  setHealthResponse: (questionId: string, answer: boolean) => void;
  setCycleData: (
    lastPeriod: Date | null,
    length: number,
    type: 'regular' | 'irregular'
  ) => void;

  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  // Get all data for submission
  getData: () => OnboardingData;
}

const initialState: OnboardingData = {
  dateOfBirth: null,
  heightCm: null,
  weightKg: null,
  activityLevel: null,
  primaryGoal: null,
  equipment: null,
  frequencyPerWeek: 3,
  includeCardio: true,
  healthResponses: [],
  lastPeriodDate: null,
  avgCycleLength: 28,
  cycleType: null,
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

  setEquipment: (equipment) => {
    set({ equipment: equipment });
  },

  setFrequency: (frequency, cardio) => {
    set({ frequencyPerWeek: frequency, includeCardio: cardio });
  },

  setHealthResponse: (questionId, answer) => {
    set((state) => {
      const existing = state.healthResponses.filter(
        (r) => r.questionId !== questionId
      );
      return {
        healthResponses: [...existing, { questionId, answer }],
      };
    });
  },

  setCycleData: (lastPeriod, length, type) => {
    set({
      lastPeriodDate: lastPeriod,
      avgCycleLength: length,
      cycleType: type,
    });
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
      equipment: state.equipment,
      frequencyPerWeek: state.frequencyPerWeek,
      includeCardio: state.includeCardio,
      healthResponses: state.healthResponses,
      lastPeriodDate: state.lastPeriodDate,
      avgCycleLength: state.avgCycleLength,
      cycleType: state.cycleType,
    };
  },
}));
