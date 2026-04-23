import { api } from '@/lib/api';
import type { ChatMessengerMessage, ChatMessengerResponse } from '@/lib/types';

export interface GetMessagesParams {
  senderId?: string;
  receiverId?: string;
  conversationId?: number;
  isRead?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const chatMessengerService = {
  /** GET /api/ChatMessenger */
  async getMessages(params: GetMessagesParams = {}): Promise<ChatMessengerResponse> {
    const { senderId, receiverId, conversationId, isRead, search, page = 1, pageSize } = params;
    return api.get<ChatMessengerResponse>('/api/ChatMessenger', {
      Page: page,
      PageSize: pageSize,
      SenderId: senderId,
      ReceiverId: receiverId,
      ConversationId: conversationId,
      IsRead: isRead,
      Search: search,
    });
  },

  /** GET /api/ChatMessenger/{id} */
  async getMessageById(id: number): Promise<ChatMessengerMessage> {
    return api.get<ChatMessengerMessage>(`/api/ChatMessenger/${id}`);
  },

  /** POST /api/ChatMessenger */
  async sendMessage(payload: {
    senderId: string;
    receiverId: string;
    content: string;
    messageType?: string;
  }): Promise<ChatMessengerMessage> {
    return api.post<ChatMessengerMessage>('/api/ChatMessenger', {
      senderId: payload.senderId,
      receiverId: payload.receiverId,
      content: payload.content,
      messageType: payload.messageType ?? 'TextChat',
      isRead: false,
    });
  },

  /** PUT /api/ChatMessenger/{id} */
  async updateMessage(
    id: number,
    payload: {
      senderId: string;
      receiverId: string;
      content: string;
      messageType: string;
      isRead: boolean;
    },
  ): Promise<ChatMessengerMessage> {
    return api.put<ChatMessengerMessage>(`/api/ChatMessenger/${id}`, payload);
  },

  /** DELETE /api/ChatMessenger/{id} */
  async deleteMessage(id: number): Promise<void> {
    return api.delete(`/api/ChatMessenger/${id}`);
  },

  /** GET /api/ChatMessenger/unread-count/{receiverId} */
  async getUnreadCount(receiverId: string): Promise<number> {
    const data = await api.get<{ unreadCount: number }>(
      `/api/ChatMessenger/unread-count/${receiverId}`,
    );
    return data.unreadCount;
  },
};
