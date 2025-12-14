import apiClient from './apiClient';

class AnalyticsService {
  async getDepartmentAnalytics() {
    // MOCK DATA
    return {
      success: true,
      data: [
        { department: 'Computer Science', count: 45, percentage: 28 },
        { department: 'Business', count: 38, percentage: 24 },
        { department: 'Engineering', count: 32, percentage: 20 },
        { department: 'Arts', count: 25, percentage: 16 },
        { department: 'Science', count: 20, percentage: 12 },
      ]
    };
  }

  async getYearAnalytics() {
    // MOCK DATA
    return {
      success: true,
      data: [
        { year: 1, count: 52, percentage: 33 },
        { year: 2, count: 48, percentage: 30 },
        { year: 3, count: 35, percentage: 22 },
        { year: 4, count: 25, percentage: 15 },
      ]
    };
  }

  async getSeverityAnalytics() {
    // MOCK DATA
    return {
      success: true,
      data: [
        { severity: 'low', count: 75, percentage: 47 },
        { severity: 'moderate', count: 58, percentage: 36 },
        { severity: 'high', count: 27, percentage: 17 },
      ]
    };
  }

  async getSessionVolume(period = 'month') {
    // MOCK DATA
    return {
      success: true,
      data: [
        { date: '2025-12-01', count: 12 },
        { date: '2025-12-02', count: 15 },
        { date: '2025-12-03', count: 18 },
        { date: '2025-12-04', count: 14 },
        { date: '2025-12-05', count: 16 },
        { date: '2025-12-06', count: 20 },
        { date: '2025-12-07', count: 10 },
      ]
    };
  }

  async getOverviewStats() {
    // MOCK DATA
    return {
      success: true,
      stats: {
        totalSessions: 342,
        totalStudents: 156,
        totalCounsellors: 12,
        averageSessionDuration: 48,
        sessionsTrend: '+12%',
        studentsTrend: '+8%',
      }
    };
  }
}

export const analyticsService = new AnalyticsService();
