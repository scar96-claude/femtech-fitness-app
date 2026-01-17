import { ScreeningQuestion, ScreeningResponse, ScreeningResult } from './types';

/**
 * Health screening questions for identifying risk factors
 * These determine which safety filters are applied to workout generation
 */
export const SCREENING_QUESTIONS: ScreeningQuestion[] = [
  // ========== PELVIC FLOOR QUESTIONS (All users) ==========
  {
    id: 'pelvic-1',
    category: 'pelvic',
    question:
      'Do you experience urine leakage when jumping, sneezing, coughing, or laughing?',
    triggerFlag: 'pelvicRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'pelvic-2',
    category: 'pelvic',
    question:
      'Do you feel heaviness, pressure, or a bulging sensation in your pelvic area during or after exercise?',
    triggerFlag: 'pelvicRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'pelvic-3',
    category: 'pelvic',
    question: 'Have you been diagnosed with pelvic organ prolapse (POP)?',
    triggerFlag: 'pelvicRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'pelvic-4',
    category: 'pelvic',
    question:
      'Have you been diagnosed with diastasis recti (abdominal separation)?',
    triggerFlag: 'pelvicRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'pelvic-5',
    category: 'pelvic',
    question: 'Have you given birth in the last 12 months?',
    triggerFlag: 'pelvicRisk',
    appliesToDemographic: 'reproductive',
  },

  // ========== BONE DENSITY QUESTIONS (Primarily 40-60) ==========
  {
    id: 'bone-1',
    category: 'bone',
    question: 'Have you been diagnosed with osteopenia or osteoporosis?',
    triggerFlag: 'boneDensityRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'bone-2',
    category: 'bone',
    question:
      'Have you experienced a bone fracture from a minor fall, bump, or low-impact incident?',
    triggerFlag: 'boneDensityRisk',
    appliesToDemographic: 'all',
  },
  {
    id: 'bone-3',
    category: 'bone',
    question:
      'Do you have a family history of osteoporosis or hip fractures?',
    triggerFlag: 'boneDensityRisk',
    appliesToDemographic: 'perimenopause',
  },
  {
    id: 'bone-4',
    category: 'bone',
    question:
      'Have you taken corticosteroid medications (like prednisone) for more than 3 months?',
    triggerFlag: 'boneDensityRisk',
    appliesToDemographic: 'all',
  },
];

/**
 * Get screening questions applicable to a specific demographic
 *
 * @param demographic - User's demographic category
 * @returns Array of applicable screening questions
 */
export function getQuestionsForDemographic(
  demographic: 'reproductive' | 'perimenopause'
): ScreeningQuestion[] {
  return SCREENING_QUESTIONS.filter(
    (q) =>
      q.appliesToDemographic === 'all' || q.appliesToDemographic === demographic
  );
}

/**
 * Process user responses to screening questions and determine risk flags
 *
 * @param responses - Array of user responses to screening questions
 * @returns Screening result with risk flags and flagged question IDs
 */
export function processScreeningResponses(
  responses: ScreeningResponse[]
): ScreeningResult {
  const yesResponses = responses.filter((r) => r.answer === true);
  const flaggedQuestions = yesResponses.map((r) => r.questionId);

  const pelvicRisk = yesResponses.some((r) => {
    const question = SCREENING_QUESTIONS.find((q) => q.id === r.questionId);
    return question?.triggerFlag === 'pelvicRisk';
  });

  const boneDensityRisk = yesResponses.some((r) => {
    const question = SCREENING_QUESTIONS.find((q) => q.id === r.questionId);
    return question?.triggerFlag === 'boneDensityRisk';
  });

  return {
    pelvicRisk,
    boneDensityRisk,
    flaggedQuestions,
  };
}

/**
 * Get a specific question by ID
 *
 * @param questionId - The question ID to find
 * @returns The screening question or undefined
 */
export function getQuestionById(
  questionId: string
): ScreeningQuestion | undefined {
  return SCREENING_QUESTIONS.find((q) => q.id === questionId);
}
