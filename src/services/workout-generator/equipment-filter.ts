import { Equipment } from './types';

/**
 * Database equipment enum values that correspond to each equipment access level.
 */
const EQUIPMENT_MAP: Record<Equipment, string[]> = {
  bodyweight: ['NONE'],
  home_gym: ['NONE', 'DUMBBELLS', 'BANDS'],
  full_gym: ['NONE', 'DUMBBELLS', 'BARBELL', 'MACHINE', 'BANDS'],
};

/**
 * Exercise type from the database (simplified for filtering).
 */
interface ExerciseForFilter {
  id: string;
  equipmentRequired: string;
  [key: string]: unknown;
}

/**
 * Filters exercises based on available equipment.
 *
 * @param exercises - Array of exercises from the database
 * @param equipment - User's equipment access level
 * @returns Exercises that can be performed with the available equipment
 */
export function filterByEquipment<T extends ExerciseForFilter>(
  exercises: T[],
  equipment: Equipment
): T[] {
  const allowed = EQUIPMENT_MAP[equipment];
  return exercises.filter((e) => allowed.includes(e.equipmentRequired));
}

/**
 * Gets the list of allowed equipment types for a given access level.
 *
 * @param equipment - User's equipment access level
 * @returns Array of allowed equipment type strings
 */
export function getAllowedEquipment(equipment: Equipment): string[] {
  return EQUIPMENT_MAP[equipment];
}
