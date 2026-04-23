import { supabase } from '@/lib/supabase';
import type { ChatMessage, Conversation, MessageReaction } from '@/lib/types';

export const chatService = {
  /** Gets or creates a conversation between two users. Returns conversation id. */
  async getOrCreateConversation(currentUserId: string, otherUserId: string): Promise<string> {
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(
        `and(user1_id.eq.${currentUserId},user2_id.eq.${otherUserId}),` +
          `and(user1_id.eq.${otherUserId},user2_id.eq.${currentUserId})`,
      )
      .maybeSingle();

    if (existing) return existing.id as string;

    const id = crypto.randomUUID();
    await supabase.from('conversations').insert({
      id,
      user1_id: currentUserId,
      user2_id: otherUserId,
      created_at: new Date().toISOString(),
    });
    return id;
  },

  /** Load recent messages for a conversation (newest first). */
  async loadMessages(conversationId: string, limit = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return (data ?? []) as ChatMessage[];
  },

  /** Send a text message. */
  async sendMessage(payload: {
    conversationId: string;
    senderId: string;
    text: string;
    replyToId?: string;
    replyToText?: string;
    replyToSenderName?: string;
  }): Promise<ChatMessage> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const row = {
      id,
      conversation_id: payload.conversationId,
      sender_id: payload.senderId,
      text: payload.text,
      status: 'sent',
      reactions: [],
      reply_to_id: payload.replyToId ?? null,
      reply_to_text: payload.replyToText ?? null,
      reply_to_sender_name: payload.replyToSenderName ?? null,
      created_at: now,
      is_deleted: false,
    };
    const { data, error } = await supabase.from('messages').insert(row).select().single();
    if (error) throw new Error(error.message);
    return data as ChatMessage;
  },

  /** Toggle a reaction on a message. */
  async toggleReaction(payload: {
    messageId: string;
    userId: string;
    emoji: string;
    currentReactions: MessageReaction[];
  }): Promise<void> {
    const { messageId, userId, emoji, currentReactions } = payload;
    const updated = currentReactions.filter((r) => r.userId !== userId);
    const had = currentReactions.some((r) => r.userId === userId && r.emoji === emoji);
    if (!had) updated.push({ userId, emoji });

    const { error } = await supabase
      .from('messages')
      .update({ reactions: updated })
      .eq('id', messageId);
    if (error) throw new Error(error.message);
  },

  /** Soft-delete a message. */
  async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ is_deleted: true, text: null })
      .eq('id', messageId);
    if (error) throw new Error(error.message);
  },

  /** Mark messages as delivered/read. */
  async markMessagesRead(conversationId: string, currentUserId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'read' })
      .eq('conversation_id', conversationId)
      .neq('sender_id', currentUserId)
      .in('status', ['sent', 'delivered']);
    if (error) throw new Error(error.message);
  },

  /** Get all conversations for a user. */
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Conversation[];
  },
};
