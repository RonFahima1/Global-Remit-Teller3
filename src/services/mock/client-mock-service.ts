/**
 * Client Mock Service
 * Provides mock data for client-related components during development
 */

/**
 * Generate mock client activities data
 */
export const getMockRecentActivities = () => {
  return {
    activities: [
      {
        id: '1',
        clientId: 'client-1',
        clientName: 'John Smith',
        clientAvatar: '',
        activityType: 'registration',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        details: 'New client registration'
      },
      {
        id: '2',
        clientId: 'client-2',
        clientName: 'Maria Rodriguez',
        clientAvatar: '',
        activityType: 'verification',
        status: 'pending',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        details: 'Identity verification in progress'
      },
      {
        id: '3',
        clientId: 'client-3',
        clientName: 'David Chen',
        clientAvatar: '',
        activityType: 'transaction',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        details: 'Completed money transfer of $2,000'
      },
      {
        id: '4',
        clientId: 'client-4',
        clientName: 'Sarah Johnson',
        clientAvatar: '',
        activityType: 'kyc',
        status: 'rejected',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        details: 'KYC documents rejected'
      },
      {
        id: '5',
        clientId: 'client-5',
        clientName: 'Michael Brown',
        clientAvatar: '',
        activityType: 'update',
        status: 'completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        details: 'Updated contact information'
      }
    ]
  };
};

/**
 * Get mock new clients count
 */
export const getMockNewClientsCount = () => {
  return { count: 12 };
};

/**
 * Get mock pending verifications count
 */
export const getMockPendingVerificationsCount = () => {
  return { count: 8 };
};

// Export all mock functions
export const clientMockService = {
  getRecentActivities: getMockRecentActivities,
  getNewClientsCount: getMockNewClientsCount,
  getPendingVerificationsCount: getMockPendingVerificationsCount
};

export default clientMockService;
