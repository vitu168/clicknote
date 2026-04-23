import { api } from '@/lib/api';
import type { UserProfile, UserProfileListResponse } from '@/lib/types';

export interface GetProfilesParams {
  search?: string;
  isNote?: boolean;
  page?: number;
  pageSize?: number;
}

export const userProfileService = {
  /** GET /api/UserProfile */
  async getProfiles(params: GetProfilesParams = {}): Promise<UserProfileListResponse> {
    const { search, isNote, page = 1, pageSize = 50 } = params;
    return api.get<UserProfileListResponse>('/api/UserProfile', {
      Page: page,
      PageSize: pageSize,
      Search: search,
      IsNote: isNote,
    });
  },

  /** GET /api/UserProfile/{id} */
  async getProfileById(id: string): Promise<UserProfile | null> {
    try {
      return await api.get<UserProfile>(`/api/UserProfile/${id}`);
    } catch {
      return null;
    }
  },

  /** GET /api/UserProfile/{id}/notes */
  async getProfileWithNotes(id: string): Promise<UserProfile | null> {
    try {
      return await api.get<UserProfile>(`/api/UserProfile/${id}/notes`);
    } catch {
      return null;
    }
  },

  /** POST /api/UserProfile */
  async createProfile(payload: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    return api.post<UserProfile>('/api/UserProfile', {
      id: payload.id,
      email: payload.email,
      name: payload.name ?? null,
      avatarUrl: payload.avatarUrl ?? null,
      isNote: false,
    });
  },

  /** PUT /api/UserProfile/{id} */
  async updateProfile(
    id: string,
    payload: {
      name: string;
      avatarUrl: string;
      email: string;
      isNote: boolean;
    },
  ): Promise<void> {
    return api.put<void>(`/api/UserProfile/${id}`, payload);
  },

  /** DELETE /api/UserProfile/{id} */
  async deleteProfile(id: string): Promise<void> {
    return api.delete(`/api/UserProfile/${id}`);
  },

  /** Ensures profile exists; creates if not. Safe to call on login. */
  async ensureProfile(payload: {
    id: string;
    email: string;
    name?: string;
    avatarUrl?: string;
  }): Promise<UserProfile> {
    const existing = await userProfileService.getProfileById(payload.id);
    if (existing) return existing;
    return userProfileService.createProfile(payload);
  },
};
