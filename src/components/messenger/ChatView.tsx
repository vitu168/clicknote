'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Trash2, SmilePlus, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { chatService } from '@/lib/services/chatService';
import type { ChatMessage, UserProfile, MessageReaction } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useI18n, type TranslationKey } from '@/lib/i18n';

interface ChatViewProps {
  currentUserId: string;
  currentUserName: string;
  otherUser: UserProfile;
}

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(iso: string, t: (key: TranslationKey) => string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return t('messenger.today');
  if (d.toDateString() === yesterday.toDateString()) return t('messenger.yesterday');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function isSameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

function getInitials(src: string | null | undefined): string {
  if (!src) return '?';
  const parts = src.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export default function ChatView({ currentUserId, otherUser }: ChatViewProps) {
  const { t } = useI18n();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [text,           setText]           = useState('');
  const [sending,        setSending]        = useState(false);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    chatService.getOrCreateConversation(currentUserId, otherUser.id).then((id) => {
      if (!cancelled) setConversationId(id);
    });
    return () => { cancelled = true; };
  }, [currentUserId, otherUser.id]);

  useEffect(() => {
    if (!conversationId) return;
    chatService.loadMessages(conversationId).then((msgs) => {
      setMessages(msgs.reverse());
    });
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        } else if (payload.eventType === 'UPDATE') {
          setMessages((prev) => prev.map((m) => m.id === (payload.new as ChatMessage).id ? (payload.new as ChatMessage) : m));
        } else if (payload.eventType === 'DELETE') {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as ChatMessage).id));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!conversationId || !text.trim() || sending) return;
    setSending(true);
    const toSend = text.trim();
    setText('');
    try {
      await chatService.sendMessage({ conversationId, senderId: currentUserId, text: toSend });
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const visibleMessages = messages.filter((m) => !m.is_deleted);

  return (
    <div className="flex flex-1 min-h-0 flex-col bg-slate-50/40 dark:bg-slate-900/20">

      {/* ── Messages ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-1">
        {visibleMessages.length === 0 && conversationId && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700">
              <MessageSquare className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{t('messenger.no_messages')}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('messenger.say_hello')} {otherUser.name ?? 'them'}!</p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = msg.sender_id === currentUserId;
          const prevMsg = messages[index - 1];
          const showDateSep = !prevMsg || !isSameDay(prevMsg.created_at, msg.created_at);
          const isSameSenderAsPrev = prevMsg && prevMsg.sender_id === msg.sender_id && !showDateSep;
          const isSameSenderAsNext = messages[index + 1]?.sender_id === msg.sender_id &&
            !(!messages[index + 1] || !isSameDay(msg.created_at, messages[index + 1].created_at));

          if (msg.is_deleted) {
            return (
              <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <span className="text-[11px] italic text-slate-300 dark:text-slate-600 select-none">{t('messenger.deleted')}</span>
              </div>
            );
          }

          return (
            <div key={msg.id}>
              {/* Date separator */}
              {showDateSep && (
                <div className="flex items-center gap-3 py-3 my-1">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60" />
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {formatDateLabel(msg.created_at, t)}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/60" />
                </div>
              )}

              {/* Message row */}
              <div className={cn(
                'group flex items-end gap-2',
                isMe ? 'flex-row-reverse' : 'flex-row',
                isSameSenderAsPrev ? 'mt-0.5' : 'mt-3',
              )}>
                {/* Other user's avatar — only show for last in group */}
                {!isMe && (
                  <div className="w-7 shrink-0 flex items-end">
                    {!isSameSenderAsNext ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-100 dark:bg-accent-950/50 text-[9px] font-bold text-accent-700 dark:text-accent-400 shrink-0">
                        {getInitials(otherUser.name ?? otherUser.email)}
                      </div>
                    ) : null}
                  </div>
                )}

                <div className={cn('flex flex-col gap-0.5 max-w-xs lg:max-w-sm xl:max-w-md', isMe ? 'items-end' : 'items-start')}>
                  {/* Reply preview */}
                  {msg.reply_to_text && (
                    <div className={cn(
                      'mb-0.5 w-full rounded-lg border-l-2 px-2.5 py-1.5 text-[11px]',
                      isMe
                        ? 'border-accent-300 dark:border-accent-700 bg-accent-50 dark:bg-accent-950/30 text-right'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50',
                    )}>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{msg.reply_to_sender_name}</p>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{msg.reply_to_text}</p>
                    </div>
                  )}

                  {/* Bubble */}
                  <div className="relative">
                    <div
                      className={cn(
                        'relative px-4 py-2.5 text-[13px] leading-relaxed shadow-sm rounded-2xl',
                        isMe
                          ? 'bg-accent-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 ring-1 ring-slate-200/80 dark:ring-slate-600/50',
                        isMe && isSameSenderAsPrev && 'rounded-tr-md',
                        isMe && isSameSenderAsNext && 'rounded-br-md',
                        !isMe && isSameSenderAsPrev && 'rounded-tl-md',
                        !isMe && isSameSenderAsNext && 'rounded-bl-md',
                      )}
                    >
                      {msg.text}
                    </div>

                    {/* Reaction picker */}
                    {reactionTarget === msg.id && (
                      <div className={cn(
                        'absolute z-20 bottom-full mb-2 flex items-center gap-0.5 rounded-2xl bg-white dark:bg-slate-700 p-1.5 shadow-xl ring-1 ring-slate-200 dark:ring-slate-600',
                        isMe ? 'right-0' : 'left-0',
                      )}>
                        {REACTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => handleReaction(msg.id, emoji, msg.reactions)}
                            aria-label={`React with ${emoji}`}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-base transition-transform hover:scale-125 hover:bg-slate-100 dark:hover:bg-slate-600"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reactions row */}
                  {msg.reactions.length > 0 && (
                    <div className={cn('flex flex-wrap gap-1 mt-0.5', isMe ? 'justify-end' : 'justify-start')}>
                      {msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleReaction(msg.id, r.emoji, msg.reactions)}
                          aria-label={`Toggle ${r.emoji}`}
                          className="inline-flex items-center gap-0.5 rounded-full bg-white dark:bg-slate-700 px-2 py-0.5 text-[11px] ring-1 ring-slate-200 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Time + hover actions */}
                  <div className={cn(
                    'flex items-center gap-1.5 mt-0.5',
                    isMe ? 'flex-row-reverse' : 'flex-row',
                  )}>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {formatTime(msg.created_at)}
                    </span>
                    <div className={cn(
                      'flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity',
                      isMe ? 'flex-row-reverse' : 'flex-row',
                    )}>
                      <button
                        type="button"
                        onClick={() => setReactionTarget(reactionTarget === msg.id ? null : msg.id)}
                        aria-label="Add reaction"
                        title="React"
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 text-slate-400 dark:text-slate-500 hover:text-accent-500 dark:hover:text-accent-400 shadow-sm transition-colors"
                      >
                        <SmilePlus className="h-3 w-3" />
                      </button>
                      {isMe && (
                        <button
                          type="button"
                          onClick={() => handleDelete(msg.id)}
                          aria-label="Delete message"
                          title="Delete"
                          className="flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <div className="shrink-0 border-t border-slate-100 dark:border-slate-700/80 bg-white dark:bg-slate-800 px-4 py-3">
        <div className="flex items-end gap-2.5">
          <div className="flex-1 min-w-0 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('messenger.placeholder')}
              rows={1}
              className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 px-4 py-2.5 text-[13px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-accent-400 dark:focus:border-accent-500 focus:ring-2 focus:ring-accent-100 dark:focus:ring-accent-950/40 transition max-h-32 overflow-y-auto"
            />
            <p className="absolute right-3 bottom-2.5 text-[10px] text-slate-300 dark:text-slate-600 pointer-events-none select-none">
              ↵ send
            </p>
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!text.trim() || sending}
            aria-label="Send message"
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all',
              text.trim() && !sending
                ? 'bg-accent-600 text-white hover:bg-accent-700 shadow-sm hover:shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed',
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
