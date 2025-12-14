import apiClient from './apiClient';

class AuthService {
  async login(credentials) {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        _id: 'user-' + Date.now(),
        email: credentials.email,
        role: credentials.email.includes('counsellor') ? 'counsellor' :
          credentials.email.includes('management') ? 'management' : 'student',
        isOnboarded: true,
        name: credentials.email.split('@')[0],
      }
    };
  }

  async register(userData) {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        _id: 'user-' + Date.now(),
        email: userData.email,
        role: 'student',
        isOnboarded: false,
        name: userData.name || userData.email.split('@')[0],
      }
    };
  }

  async completeOnboarding(onboardingData) {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      user: {
        ...onboardingData,
        isOnboarded: true,
      }
    };
  }

  async getCurrentUser() {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      user: {
        _id: 'mock-user-id',
        email: 'test@example.com',
        role: 'student',
        isOnboarded: true,
        name: 'Test User',
      }
    };
  }

  async updateProfile(profileData) {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      user: profileData
    };
  }

  async getQRCode() {
    // MOCK DATA - Frontend testing only
    return {
      success: true,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    };
  }
}

export const authService = new AuthService();
