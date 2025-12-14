import apiClient from './apiClient';

class MoodService {
  async getMoods() {
    // MOCK DATA
    return {
      success: true,
      moods: [
        { _id: '1', mood: 'happy', intensity: 4, note: 'Great day!', date: '2025-12-14', activities: ['Exercise', 'Study'] },
        { _id: '2', mood: 'calm', intensity: 3, note: 'Relaxing weekend', date: '2025-12-13', activities: ['Reading'] },
        { _id: '3', mood: 'anxious', intensity: 3, note: 'Exam stress', date: '2025-12-12', activities: ['Study'] },
        { _id: '4', mood: 'neutral', intensity: 3, note: 'Regular day', date: '2025-12-11', activities: ['Classes'] },
      ]
    };
  }

  async logMood(moodData) {
    // MOCK DATA
    return {
      success: true,
      mood: {
        _id: 'mood-' + Date.now(),
        ...moodData,
        date: new Date().toISOString(),
      }
    };
  }

  async getMonthMoods(year, month) {
    // MOCK DATA
    const mockMoods = {};
    for (let i = 1; i <= 14; i++) {
      mockMoods[i] = {
        mood: ['happy', 'calm', 'anxious', 'sad', 'neutral'][Math.floor(Math.random() * 5)],
        intensity: Math.floor(Math.random() * 5) + 1
      };
    }
    return {
      success: true,
      moods: mockMoods
    };
  }

  async getTodayMood() {
    // MOCK DATA
    return {
      success: true,
      mood: { _id: '1', mood: 'happy', intensity: 4, note: 'Great day!', activities: ['Exercise'] }
    };
  }
}

export const moodService = new MoodService();
