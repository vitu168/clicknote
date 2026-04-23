'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Trash2, SmilePlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { chatService } from '@/lib/services/chatService';
import type { ChatMessage, UserProfile, MessageReaction } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatViewProps {
  currentUserId: string;
  currentUserName: string;
  otherUser: UserProfile;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatView({ currentUserId, otherUser }: ChatViewProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load or create conversation on mount
  useEffect(() => {
    let cancelled = false;
    chatService.getOrCreateConversation(currentUserId, otherUser.id).then((id) => {
      if (cancelled) return;
      setConversationId(id);
    });
    return () => { cancelled = true; };
  }, [currentUserId, otherUser.id]);

  // Load messages when conversation ready
  useEffect(() => {
    if (!conversationId) return;
    chatService.loadMessages(conversationId).then((msgs) => {
      setMessages(msgs.reverse()); // oldest first
    });
  }, [conversationId]);

  // Realtime subscription
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) =>
              prev.map((m) => (m.id === (payload.new as ChatMessage).id ? (payload.new as ChatMessage) : m)),
            );
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter((m) => m.id !== (payload.old as ChatMessage).id));
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!conversationId || !text.trim() || sending) return;
    setSending(true);
    try {
      setText('');
      await chatService.sendMessage({
        conversationId,
        senderId: currentUserId,
        text: text.trim(),
      });
    } finally {
      setSending(false);
    }
  }, [conversationId, text, sending, currentUserId]);

  async function handleDelete(messageId: string) {
    await chatService.deleteMessage(messageId);
  }

  async function handleReaction(messageId: string, emoji: string, current: MessageReaction[]) {
    setReactionTarget(null);
    await chatService.toggleReaction({ messageId, userId: currentUserId, emoji, currentReactions: current });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          if (msg.is_deleted) {
            return (
              <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <span className="text-[11px] italic text-slate-400">Message deleted</span>
              </div>
            );
          }
          return (
            <div key={msg.id} className={cn('group flex items-end gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}>
              {/* Avatar */}
              {!isMe && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                  {(otherUser.name ?? otherUser.email ?? 'U').slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className={cn('relative max-w-xs lg:max-w-md', isMe ? 'items-end' : 'items-start')}>
                {/* Reply preview */}
                {msg.reply_to_text && (
                  <div className={cn(
                    'mb-1 rounded-lg border-l-2 px-2.5 py-1 text-[11px]',
                    isMe ? 'border-indigo-300 bg-indigo-50 text-right' : 'border-slate-300 bg-slate-50',
                  )}>
                    <span className="font-semibold">{msg.reply_to_sender_name}</span>
                    <p className="text-slate-500 line-clamp-1">{msg.reply_to_text}</p>
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={cn(
                    'rounded-2xl px-3.5 py-2.5 text-sm shadow-sm',
                    isMe
                      ? 'rounded-br-md bg-indigo-600 text-white'
                      : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200',
                  )}
                >
                  {msg.text}
                </div>

                {/* Reactions */}
                {msg.reactions.length > 0 && (
                  <div className={cn('mt-1 flex flex-wrap gap-1', isMe ? 'justify-end' : 'justify-start')}>
                    {msg.reactions.map((r, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleReaction(msg.id, r.emoji, msg.reactions)}
                        aria-label={`Toggle ${r.emoji} reaction`}
                        className="inline-flex items-center gap-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs hover:bg-slate-200 transition-colors"
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Time + actions */}
                <div className={cn('mt-0.5 flex items-center gap-1.5', isMe ? 'justify-end' : 'justify-start')}>
                  <span className="text-[10px] text-slate-400">{formatTime(msg.created_at)}</span>

                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                    <button
                      type="button"
                      onClick={() => setReactionTarget(reactionTarget === msg.id ? null : msg.id)}
                      aria-label="Add reaction"
                      title="Add reaction"
                      className="rounded p-0.5 text-slate-400 hover:text-indigo-500 transition-colors"
                    >
                      <SmilePlus className="h-3 w-3" />
                    </button>
                    {isMe && (
                      <button
                        type="button"
                        onClick={() => handleDelete(msg.id)}
                        aria-label="Delete message"
                        title="Delete message"
                        className="rounded p-0.5 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Reaction picker */}
                {reactionTarget === msg.id && (
                  <div className={cn(
                    'absolute z-10 flex gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-200',
                    isMe ? 'right-0 bottom-8' : 'left-0 bottom-8',
                  )}>
                    {REACTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReaction(msg.id, emoji, msg.reactions)}
                        aria-label={`React with ${emoji}`}
                        className="rounded-lg p-1 text-base hover:bg-slate-100 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition max-h-32 overflow-y-auto"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            aria-label="Send message"
            title="Send message"
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-colors',
              'hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed',
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
