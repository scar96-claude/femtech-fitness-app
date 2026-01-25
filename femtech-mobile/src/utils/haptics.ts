import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Safe haptics utility that only runs on native platforms
 * Haptics are not available on web
 */

export async function impactLight(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export async function impactMedium(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}

export async function impactHeavy(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }
}

export async function notificationSuccess(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

export async function notificationWarning(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

export async function notificationError(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export async function selectionChanged(): Promise<void> {
  if (Platform.OS !== 'web') {
    await Haptics.selectionAsync();
  }
}
