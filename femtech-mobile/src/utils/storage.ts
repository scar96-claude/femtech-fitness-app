import * as SecureStore from 'expo-secure-store';

/**
 * Async storage helpers using Expo SecureStore
 * Provides type-safe access to local storage
 */

/**
 * Store a string value securely
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
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
    return await SecureStore.getItemAsync(key);
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
    await SecureStore.deleteItemAsync(key);
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
