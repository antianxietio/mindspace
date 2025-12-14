import apiClient from './apiClient';

class SessionService {
  async getSessions() {
    // MOCK DATA
    return {
      success: true,
      sessions: [
        {
          _id: '1',
          counsellor: { name: 'Dr. Sarah Johnson' },
          date: '2025-12-10',
          duration: 45,
          notes: 'Discussed stress management techniques',
          severity: 'moderate'
        },
        {
          _id: '2',
          counsellor: { name: 'Dr. Sarah Johnson' },
          date: '2025-12-08',
          duration: 60,
          notes: 'Career guidance session',
          severity: 'low'
        },
      ]
    };
  }

  async getSessionById(id) {
    // MOCK DATA
    return {
      success: true,
      session: {
        _id: id,
        student: { name: 'John Doe', studentId: 'STU001', department: 'Computer Science', year: 2 },
        counsellor: { name: 'Dr. Sarah Johnson' },
        date: '2025-12-10',
        duration: 45,
        notes: 'Discussed stress management techniques',
        severity: 'moderate',
        followUpRequired: true
      }
    };
  }

  async startSession(qrData) {
    // MOCK DATA
    return {
      success: true,
      session: {
        _id: 'session-' + Date.now(),
        student: { name: 'John Doe', studentId: qrData, department: 'Computer Science', year: 2 },
        startTime: new Date().toISOString(),
      }
    };
  }

  async endSession(sessionId, sessionData) {
    // MOCK DATA
    return {
      success: true,
      session: {
        _id: sessionId,
        ...sessionData,
        endTime: new Date().toISOString(),
      }
    };
  }

  async getStudentHistory(studentId) {
    // MOCK DATA
    return {
      success: true,
      sessions: [
        {
          _id: '1',
          date: '2025-12-10',
          duration: 45,
          notes: 'Stress management discussion',
          severity: 'moderate'
        },
        {
          _id: '2',
          date: '2025-11-25',
          duration: 60,
          notes: 'Initial consultation',
          severity: 'high'
        },
      ]
    };
  }

  async submitFeedback(sessionId, feedback) {
    // MOCK DATA
    return {
      success: true,
      message: 'Feedback submitted successfully'
    };
  }
}

export const sessionService = new SessionService();
