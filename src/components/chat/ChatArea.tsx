import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';
import { MessageSquare } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  onDeleteMessage?: (id: string) => void;
  onEditMessage?: (id: string, content: string) => void;
}

export const ChatArea = ({ messages, onDeleteMessage, onEditMessage }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gradient">Start a conversation</h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Configure your API provider in settings and begin chatting with AI models locally or remotely.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {['Creative writing', 'Code review', 'Roleplay', 'Analysis'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-secondary rounded-full text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onDelete={onDeleteMessage}
          onEdit={onEditMessage}
        />
      ))}
    </div>
  );
};
