import { AppLayout } from "@/components/Layout";
import { useChatStream, useConversations, useCreateConversation } from "@/hooks/use-chat";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Plus, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

function ChatMessage({ role, content }: { role: string; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3 mb-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div 
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none" 
            : "bg-white dark:bg-zinc-800 border border-border rounded-tl-none"
        )}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

export default function AromiChat() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: conversations, isLoading: loadingConvos } = useConversations();
  const { mutate: createConvo, isPending: creating } = useCreateConversation();
  
  // If no active ID, use the first conversation or null
  useEffect(() => {
    if (!activeId && conversations && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const { messages, streamingContent, isStreaming, sendMessage } = useChatStream(activeId || 0);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !activeId) return;
    sendMessage({ content: input });
    setInput("");
  };

  const handleNewChat = () => {
    createConvo("New Chat", {
      onSuccess: (data) => setActiveId(data.id)
    });
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar - History */}
        <div className="w-64 hidden md:flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-border p-4 shadow-sm">
          <Button onClick={handleNewChat} disabled={creating} className="w-full mb-4 gap-2" variant="outline">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {conversations?.map(chat => (
              <button
                key={chat.id}
                onClick={() => setActiveId(chat.id)}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-lg text-sm transition-colors flex items-center gap-2",
                  activeId === chat.id 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-secondary text-muted-foreground"
                )}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm overflow-hidden">
          {activeId ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-secondary/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="font-display font-bold">AROMI Coach</span>
                </div>
                <span className="text-xs text-muted-foreground">AI-Powered</span>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-black/20">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Bot className="w-16 h-16 mb-4" />
                    <p>Start a conversation with AROMI</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} />
                ))}
                {isStreaming && (
                  <ChatMessage role="assistant" content={streamingContent} />
                )}
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-zinc-900 border-t border-border">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about workouts, nutrition, or wellness..."
                    className="flex-1"
                    disabled={isStreaming}
                  />
                  <Button type="submit" disabled={!input.trim() || isStreaming}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <Bot className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a chat or create a new one to start.</p>
              <Button onClick={handleNewChat} variant="outline" className="mt-4">Create New Chat</Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
