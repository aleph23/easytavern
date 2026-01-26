import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Loader2, Image as ImageIcon, Mic, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="flex items-end gap-3">
        <div className="flex gap-1">
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title="Attach image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
            title="Voice input"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Shift+Enter for new line)"
          disabled={isLoading || disabled}
          rows={1}
          className={cn(
            'flex-1 bg-transparent resize-none focus:outline-none placeholder:text-muted-foreground',
            'scrollbar-thin max-h-[200px]'
          )}
        />

        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          className={cn(
            'p-2 rounded-lg transition-all',
            message.trim() && !isLoading && !disabled
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-border'
              : 'bg-secondary text-muted-foreground cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-typing" style={{ animationDelay: '400ms' }} />
          </div>
          <span>Generating response...</span>
          <button className="ml-auto p-1 hover:bg-destructive/20 rounded transition-colors">
            <StopCircle className="w-4 h-4 text-destructive" />
          </button>
        </div>
      )}
    </div>
  );
};
