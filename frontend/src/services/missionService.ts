import api from './api';

export interface Mission {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  numberOfSites: number;
  createdAt: string;
  _count?: {
    registrations: number;
    distributions: number;
  };
}

export interface MissionRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: 'MALE' | 'FEMALE';
  campus: string;
  yearOfStudy?: number;
  isVisitor: boolean;
  homeChurch?: string;
  previousMissionsCount: number;
  isFirstTime: boolean;
}

export interface SiteDistribution {
  siteNumber: number;
  total: number;
  male: number;
  female: number;
  firstTimers: number;
  experienced: number;
  veterans: number;
  campuses: Record<string, number>;
  yearsOfStudy: Record<number, number>;
  visitors: number;
  missionaries: MissionRegistration[];
}

export interface UploadResponse {
  count: number;
  warnings: {
    campus: Array<{ original: string; normalized: string; suggestion: string }>;
    yearOfStudy: any[];
  };
  stats: {
    male: number;
    female: number;
    firstTimers: number;
    visitors: number;
    byCampus: Record<string, number>;
  };
}

const missionService = {
  // Get all missions
  async getMissions() {
    const response = await api.get<{ success: boolean; data: Mission[] }>('/api/missions');
    return response.data. data;
  },

  // Get active mission
  async getActiveMission() {
    const response = await api.get<{ success: boolean; data: Mission | null }>('/api/missions/active');
    return response.data.data;
  },

  // Create new mission
  async createMission(data: {
    name: string;
    location: string;
    startDate: string;
    endDate: string;
    numberOfSites: number;
  }) {
    const response = await api.post<{ success: boolean; data: Mission }>('/api/missions', data);
    return response.data. data;
  },

  // Upload registrations
  async uploadRegistrations(missionId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ success: boolean; data: UploadResponse; message: string }>(
      `/api/missions/${missionId}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Run distribution algorithm
  async distributeMissionaries(missionId: string) {
    const response = await api. post<{ 
      success: boolean; 
      data: { sites: Omit<SiteDistribution, 'missionaries'>[] };
      message: string;
    }>(`/api/missions/${missionId}/distribute`);
    return response.data;
  },

  // Get distribution results
  async getDistribution(missionId: string) {
    const response = await api. get<{ success: boolean; data: SiteDistribution[] }>(
      `/api/missions/${missionId}/distribution`
    );
    return response.data. data;
  },

  // Export distribution to Excel
  async exportDistribution(missionId: string, missionName: string) {
    const response = await api.get(`/api/missions/${missionId}/export`, {
      responseType: 'blob',
    });

    // Create download link
    const url = window. URL.createObjectURL(new Blob([response.data]));
    const link = document. createElement('a');
    link. href = url;
    link. setAttribute('download', `${missionName. replace(/\s+/g, '_')}_Distribution.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Delete a mission
  async deleteMission(missionId: string) {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/missions/${missionId}`);
    return response.data;
  },
};

export default missionService;