import apiClient from './apiClient';

class AppointmentService {
  async getCounsellors() {
    // MOCK DATA
    return {
      success: true,
      counsellors: [
        { _id: '1', name: 'Dr. Sarah Johnson', department: 'Psychology', specialization: 'Anxiety & Depression', rating: 4.8, availableSlots: 12, isActive: false },
        { _id: '2', name: 'Dr. Michael Chen', department: 'Career Counseling', specialization: 'Career Development', rating: 4.6, availableSlots: 8, isActive: true },
        { _id: '3', name: 'Dr. Emily Williams', department: 'Academic', specialization: 'Study Skills', rating: 4.9, availableSlots: 5, isActive: false },
      ]
    };
  }

  async getTimeSlots(counsellorId, date) {
    // MOCK DATA
    return {
      success: true,
      slots: [
        { _id: '1', time: '09:00 AM', available: true },
        { _id: '2', time: '10:00 AM', available: true },
        { _id: '3', time: '11:00 AM', available: false },
        { _id: '4', time: '02:00 PM', available: true },
        { _id: '5', time: '03:00 PM', available: true },
      ]
    };
  }

  async bookAppointment(appointmentData) {
    // MOCK DATA
    return {
      success: true,
      appointment: {
        _id: 'apt-' + Date.now(),
        ...appointmentData,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      }
    };
  }

  async getMyAppointments() {
    // MOCK DATA
    return {
      success: true,
      appointments: [
        {
          _id: '1',
          counsellor: { name: 'Dr. Sarah Johnson', specialization: 'Anxiety & Depression' },
          date: '2025-12-20',
          time: '10:00 AM',
          status: 'scheduled',
          type: 'individual',
          reason: 'Stress management'
        },
        {
          _id: '2',
          counsellor: { name: 'Dr. Michael Chen', specialization: 'Career Development' },
          date: '2025-12-15',
          time: '02:00 PM',
          status: 'completed',
          type: 'individual',
          reason: 'Career guidance'
        },
      ]
    };
  }

  async getAppointmentById(id) {
    // MOCK DATA
    return {
      success: true,
      appointment: {
        _id: id,
        counsellor: { name: 'Dr. Sarah Johnson', specialization: 'Anxiety & Depression' },
        date: '2025-12-20',
        time: '10:00 AM',
        status: 'scheduled',
        type: 'individual',
        reason: 'Stress management',
        notes: 'Follow-up session'
      }
    };
  }

  async cancelAppointment(id) {
    // MOCK DATA
    return { success: true, message: 'Appointment cancelled successfully' };
  }

  async rescheduleAppointment(id, newData) {
    // MOCK DATA
    return {
      success: true,
      appointment: { _id: id, ...newData, status: 'scheduled' }
    };
  }

  async requestReschedule(id, reason) {
    // MOCK DATA
    return { success: true, message: 'Reschedule request sent' };
  }

  // Counsellor endpoints
  async createTimeSlot(slotData) {
    // MOCK DATA
    return {
      success: true,
      slot: { _id: 'slot-' + Date.now(), ...slotData }
    };
  }

  async updateTimeSlot(id, slotData) {
    // MOCK DATA
    return {
      success: true,
      slot: { _id: id, ...slotData }
    };
  }

  async deleteTimeSlot(id) {
    // MOCK DATA
    return { success: true, message: 'Time slot deleted' };
  }

  async getMyCounsellorAppointments() {
    // MOCK DATA
    return {
      success: true,
      appointments: [
        {
          _id: '1',
          student: { name: 'John Doe', department: 'Computer Science', year: 2 },
          date: '2025-12-14',
          time: '10:00 AM',
          status: 'scheduled',
          reason: 'Academic stress'
        },
        {
          _id: '2',
          student: { name: 'Jane Smith', department: 'Business', year: 3 },
          date: '2025-12-14',
          time: '02:00 PM',
          status: 'scheduled',
          reason: 'Career counseling'
        },
      ]
    };
  }
}

export const appointmentService = new AppointmentService();
