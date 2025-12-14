import apiClient from './apiClient';
import { storageService } from './storageService';

class JournalService {
  async getJournals() {
    // MOCK DATA
    return {
      success: true,
      journals: [
        {
          _id: '1',
          title: 'First Week of Classes',
          content: 'Today was overwhelming but exciting. Met many new people and adjusting to the schedule.',
          mood: 'anxious',
          date: '2025-12-10',
          tags: ['academic', 'social']
        },
        {
          _id: '2',
          title: 'Study Group Success',
          content: 'Had a productive study session with my group. Feeling more confident about the upcoming exam.',
          mood: 'happy',
          date: '2025-12-12',
          tags: ['academic', 'achievement']
        },
      ]
    };
  }

  async createJournal(journalData) {
    // MOCK DATA
    return {
      success: true,
      journal: {
        _id: 'journal-' + Date.now(),
        ...journalData,
        date: new Date().toISOString(),
      }
    };
  }

  async updateJournal(id, journalData) {
    // MOCK DATA
    return {
      success: true,
      journal: { _id: id, ...journalData }
    };
  }

  async deleteJournal(id) {
    // MOCK DATA
    return { success: true, message: 'Journal deleted' };
  }

  async syncOfflineJournals() {
    const offlineJournals = await storageService.getOfflineJournals();
    const syncedJournals = [];

    for (const journal of offlineJournals) {
      try {
        const { tempId, isOffline, ...journalData } = journal;
        const response = await apiClient.post('/journals', journalData);
        syncedJournals.push(response.data);
      } catch (error) {
        console.error('Error syncing journal:', error);
      }
    }

    // Clear offline journals after successful sync
    if (syncedJournals.length === offlineJournals.length) {
      await storageService.clearOfflineJournals();
    }

    return syncedJournals;
  }
}

export const journalService = new JournalService();
