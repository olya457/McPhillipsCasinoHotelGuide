import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageKeys = {
  onboarding: '@mcphillips/onboarding-done',
  reminders: '@mcphillips/reminders',
  bookings: '@mcphillips/bookings',
  voting: '@mcphillips/voting',
  photos: '@mcphillips/photos',
} as const;

export const readValue = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeValue = async (key: string, value: unknown) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    return;
  }
};
