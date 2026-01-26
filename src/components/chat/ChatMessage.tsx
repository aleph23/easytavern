import { Message } from '@/types/chat';
import { User, Bot, Settings, Copy, Trash2, Edit2, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export const ChatMessage = ({ message, onDelete, onEdit }: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onEdit?.(message.id, editContent);
    setIsEditing(false);
  };

  const roleConfig = {
    user: {
      icon: User,
      label: 'You',
      containerClass: 'message-user text-white',
      iconClass: 'bg-chat-user',
    },
    assistant: {
      icon: Bot,
      label: 'Assistant',
      containerClass: 'message-assistant',
      iconClass: 'bg-chat-assistant',
    },
    system: {
      icon: Settings,
      label: 'System',
      containerClass: 'message-system',
      iconClass: 'bg-chat-system',
    },
  };

  const config = roleConfig[message.role];
  const Icon = config.icon;

  return (
    <div className={cn(
      'group relative p-4 rounded-lg animate-fade-in',
      config.containerClass
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          config.iconClass
        )}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{config.label}</span>
            {message.model && (
              <span className="text-xs text-muted-foreground font-mono">
                {message.model}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-background/50 border border-border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={4}
              />
              <div className="flex gap-2">
          <button
            onClick={handleSaveEdit}
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
              {message.content}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
            title="Copy"
          >
            {copied ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          {message.role !== 'system' && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => onDelete?.(message.id)}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
