'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CustomerAvatar } from '@/components/ui/CustomerAvatar';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { formatIndianDate, formatIndianPhone, cn } from '@/lib/utils';
import {
  MessageSquare,
  Send,
  Sparkles,
  Search,
  Bot,
  CheckCheck,
} from 'lucide-react';

export default function MessagesPage() {
  const { messages, sendWhatsAppMessage } = useStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedMessageId, setSelectedMessageId] = useState<string>(messages[0]?.id || '');
  const [replyInput, setReplyInput] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const activeMessage = messages.find((m) => m.id === selectedMessageId) || messages[0];

  const tabOptions = [
    { id: 'all', label: 'All Messages', count: messages.length },
    { id: 'needs_review', label: 'Needs Review', count: messages.filter((m) => m.needsReview).length },
    { id: 'replied', label: 'Customer Replied', count: messages.filter((m) => m.replyStatus === 'replied').length },
    { id: 'delivered', label: 'Delivered', count: messages.filter((m) => m.deliveryStatus === 'delivered' || m.deliveryStatus === 'read').length },
  ];

  const filteredMessages = messages.filter((m) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'needs_review'
        ? m.needsReview
        : activeTab === 'replied'
        ? m.replyStatus === 'replied'
        : m.deliveryStatus === 'delivered' || m.deliveryStatus === 'read';

    const matchesSearch =
      !searchFilter.trim() ||
      m.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.customerPhone.includes(searchFilter) ||
      m.body.toLowerCase().includes(searchFilter.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSendReply = (customText?: string) => {
    const text = customText || replyInput;
    if (!text.trim() || !activeMessage) return;

    sendWhatsAppMessage(activeMessage.id, text);
    setReplyInput('');

    toast({
      title: 'WhatsApp Message Sent',
      description: `Dispatched message to ${activeMessage.customerName} via Gupshup WhatsApp API.`,
      type: 'success',
    });
  };

  return (
    <AppShell pageTitle="Messages">
      <PageHeader
        title="WhatsApp Messaging & Recovery Inbox"
        subtitle="Manage automated reminders, view AI-parsed customer responses, and approve replies."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              WhatsApp Provider: Gupshup API Online
            </span>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="mb-6">
        <Tabs
          options={tabOptions}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
      </div>

      {/* Two-Panel WhatsApp Inbox Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left List (4 Cols) */}
        <Card className="lg:col-span-5 p-0 overflow-hidden flex flex-col h-full max-h-[700px]">
          {/* Search Bar */}
          <div className="p-3.5 border-b border-border bg-surface-muted/30">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversation..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-apple border border-border bg-surface text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No conversations found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === activeMessage?.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={cn(
                      'p-4 flex items-start gap-3 transition-colors cursor-pointer text-left',
                      isSelected
                        ? 'bg-primary/10 border-l-4 border-l-primary'
                        : 'hover:bg-surface-muted/50'
                    )}
                  >
                    <CustomerAvatar name={msg.customerName} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                          {msg.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                          {formatIndianDate(msg.sentAt).split(',')[0]}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-muted-foreground truncate leading-snug">
                        {msg.body}
                      </p>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-muted border border-border text-muted-foreground capitalize">
                          {msg.type.replace('_', ' ')}
                        </span>

                        {msg.needsReview ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Needs Review
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCheck className="w-3 h-3" />
                            {msg.deliveryStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Active Conversation Panel (7 Cols) */}
        <Card className="lg:col-span-7 p-0 flex flex-col h-full max-h-[700px] overflow-hidden">
          {activeMessage ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b border-border bg-surface-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CustomerAvatar name={activeMessage.customerName} size="md" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {activeMessage.customerName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {formatIndianPhone(activeMessage.customerPhone)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={activeMessage.deliveryStatus} type="whatsapp" size="sm" />
                </div>
              </div>

              {/* AI Intent Detection Alert if ambiguous */}
              {activeMessage.aiExtractedIntent && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-teal-500/10 to-transparent border-b border-border flex items-start gap-2.5 text-xs">
                  <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-foreground">
                      AI Intent Parsed: {activeMessage.aiExtractedIntent.intent.toUpperCase()} ({Math.round(activeMessage.aiExtractedIntent.confidence * 100)}% confidence)
                    </span>
                    <p className="text-muted-foreground mt-0.5 leading-snug">
                      {activeMessage.aiExtractedIntent.summary}
                    </p>
                  </div>
                </div>
              )}

              {/* Chat Message Bubble Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface/30">
                {activeMessage.conversationHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      'flex flex-col max-w-[80%]',
                      chat.sender === 'customer' ? 'items-start mr-auto' : 'items-end ml-auto'
                    )}
                  >
                    <div
                      className={cn(
                        'p-3.5 rounded-apple-xl text-xs leading-relaxed shadow-subtle',
                        chat.sender === 'customer'
                          ? 'bg-surface-muted border border-border text-foreground rounded-tl-none'
                          : 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                      )}
                    >
                      {chat.text}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{formatIndianDate(chat.timestamp)}</span>
                      {chat.sender !== 'customer' && <CheckCheck className="w-3 h-3 text-primary" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggested Reply Chips */}
              {activeMessage.suggestedReplies && activeMessage.suggestedReplies.length > 0 && (
                <div className="p-3 border-t border-border bg-surface-muted/20 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Suggested 1-Click WhatsApp Replies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeMessage.suggestedReplies.map((replyText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendReply(replyText)}
                        className="text-left text-xs px-2.5 py-1.5 rounded-apple bg-surface border border-border text-foreground hover:bg-surface-elevated hover:border-primary/50 transition-colors"
                      >
                        "{replyText}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Composer */}
              <div className="p-3.5 border-t border-border bg-surface flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${activeMessage.customerName.split(' ')[0]} via WhatsApp...`}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  className="flex-1 min-h-[44px] rounded-apple border border-border bg-surface px-3.5 py-2 text-xs sm:text-sm text-foreground focus:outline-none focus:border-primary"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleSendReply()}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">Select a conversation from the left to view messages</p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
