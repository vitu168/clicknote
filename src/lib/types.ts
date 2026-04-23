export interface NoteInfo {
  id: number;
  name: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userId: string | null;
  isFavorites: boolean;
}

export interface NoteListResponse {
  items: NoteInfo[];
  totalCount: number;
}
export interface UserProfile {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string | null;
  email: string | null;
  isNote: boolean | null;
}

export interface UserProfileListResponse {
  items: UserProfile[];
  totalCount: number;
}

export interface ChatMessengerMessage {
  id: number;
  conversationId: number;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessengerResponse {
  items: ChatMessengerMessage[];
  totalCount: number;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string | null;
  image_url: string | null;
  status: MessageStatus;
  reactions: MessageReaction[];
  reply_to_id: string | null;
  reply_to_text: string | null;
  reply_to_sender_name: string | null;
  created_at: string;
  is_deleted: boolean;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  body: string;
  receivedAt: string;
  senderId: string | null;
  isRead: boolean;
}
