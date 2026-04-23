import { api } from '@/lib/api';
import type { NoteInfo, NoteListResponse } from '@/lib/types';

export interface GetNotesParams {
  userId?: string;
  search?: string;
  isFavorites?: boolean;
  page?: number;
  pageSize?: number;
}

export const noteService = {
  /** GET /api/NoteInfo */
  async getNotes(params: GetNotesParams = {}): Promise<NoteListResponse> {
    const { userId, search, isFavorites, page = 1, pageSize = 20 } = params;
    return api.get<NoteListResponse>('/api/NoteInfo', {
      Page: page,
      PageSize: pageSize,
      UserId: userId,
      Search: search,
      IsFavorites: isFavorites,
    });
  },

  /** GET /api/NoteInfo/{id} */
  async getNoteById(id: number): Promise<NoteInfo> {
    return api.get<NoteInfo>(`/api/NoteInfo/${id}`);
  },

  /** POST /api/NoteInfo */
  async createNote(payload: {
    name: string;
    description?: string;
    userId: string;
    isFavorites?: boolean;
  }): Promise<NoteInfo> {
    return api.post<NoteInfo>('/api/NoteInfo', {
      name: payload.name,
      description: payload.description ?? null,
      userId: payload.userId,
      isFavorites: payload.isFavorites ?? false,
    });
  },

  /** PUT /api/NoteInfo/{id} */
  async updateNote(
    id: number,
    payload: {
      name?: string;
      description?: string;
      userId: string;
      isFavorites?: boolean;
    },
  ): Promise<void> {
    return api.put<void>(`/api/NoteInfo/${id}`, {
      name: payload.name,
      description: payload.description,
      userId: payload.userId,
      isFavorites: payload.isFavorites ?? false,
    });
  },

  /** DELETE /api/NoteInfo/{id} */
  async deleteNote(id: number): Promise<void> {
    return api.delete(`/api/NoteInfo/${id}`);
  },

  /** POST /api/NoteInfo/batchCreateNotes */
  async batchCreateNotes(notes: { name: string; description?: string; userId: string }[]): Promise<unknown> {
    return api.post('/api/NoteInfo/batchCreateNotes', { notes });
  },
};
