import { Platform } from 'react-native';

/**
 * Async storage helpers with platform-aware implementation
 * Uses SecureStore on native, localStorage on web
 */

// Import SecureStore conditionally based on platform
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SecureStore = Platform.OS !== 'web' ? require('expo-secure-store') : null;

/**
 * Store a string value securely
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else if (SecureStore) {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
}

/**
 * Retrieve a string value
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else if (SecureStore) {
      return await SecureStore.getItemAsync(key);
    }
    return null;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
}

/**
 * Remove a stored value
 */
export async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else if (SecureStore) {
      await SecureStore.deleteItemAsync(key);
    }
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
    throw error;
  }
}

/**
 * Store a JSON value
 */
export async function setJson<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error storing JSON ${key}:`, error);
    throw error;
  }
}

/**
 * Retrieve a JSON value
 */
export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await getItem(key);
    if (jsonValue === null) return null;
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`Error parsing JSON ${key}:`, error);
    return null;
  }
}

/**
 * Clear multiple keys
 */
export async function clearKeys(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => removeItem(key)));
}
