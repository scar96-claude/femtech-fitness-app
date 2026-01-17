import { differenceInYears } from 'date-fns';
import { Protocol } from './types';

/**
 * Routes users to the appropriate workout protocol based on age.
 * - Ages 20-39: cycle_sync (menstrual cycle-based training)
 * - Ages 40-60: osteo_strong (bone density & cortisol management)
 *
 * @param dateOfBirth - User's date of birth
 * @returns The appropriate protocol for the user
 */
export function getProtocol(dateOfBirth: Date): Protocol {
  const age = differenceInYears(new Date(), dateOfBirth);
  return age < 40 ? 'cycle_sync' : 'osteo_strong';
}

/**
 * Gets the user's current age from their date of birth.
 *
 * @param dateOfBirth - User's date of birth
 * @returns User's age in years
 */
export function getAge(dateOfBirth: Date): number {
  return differenceInYears(new Date(), dateOfBirth);
}
