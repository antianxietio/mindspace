// import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const JOURNALS_KEY = 'offline_journals';

class StorageService {
  // Using AsyncStorage instead of SecureStore to avoid FLAG_SECURE screen capture blocking
  async setToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // AsyncStorage for non-sensitive data
  async setUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }

  // Offline journals storage
  async saveOfflineJournals(journals) {
    try {
      await AsyncStorage.setItem(JOURNALS_KEY, JSON.stringify(journals));
    } catch (error) {
      console.error('Error saving offline journals:', error);
    }
  }

  async getOfflineJournals() {
    try {
      const journals = await AsyncStorage.getItem(JOURNALS_KEY);
      return journals ? JSON.parse(journals) : [];
    } catch (error) {
      console.error('Error retrieving offline journals:', error);
      return [];
    }
  }

  async clearOfflineJournals() {
    try {
      await AsyncStorage.removeItem(JOURNALS_KEY);
    } catch (error) {
      console.error('Error clearing offline journals:', error);
    }
  }

  // Generic storage methods
  async setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  }

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error retrieving ${key}:`, error);
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  }

  async clear() {
    try {
      await AsyncStorage.clear();
      await this.removeToken();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}

export const storageService = new StorageService();
