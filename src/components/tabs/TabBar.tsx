import React from 'react';
import { Tab } from '@/types/tabs';
import { X, Plus, MessageSquare, Settings, User, Box, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
}

const getIconForType = (type: Tab['type']) => {
  switch (type) {
    case 'chat': return <MessageSquare className="w-4 h-4" />;
    case 'settings': return <Settings className="w-4 h-4" />;
    case 'character': return <User className="w-4 h-4" />;
    case 'extensions': return <Box className="w-4 h-4" />;
    case 'world-info': return <Globe className="w-4 h-4" />;
    default: return <MessageSquare className="w-4 h-4" />;
  }
};

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onNewTab,
}) => {
  return (
    <div className="flex items-center bg-secondary/30 border-b border-border h-10 overflow-x-auto no-scrollbar select-none">
      <div className="flex flex-1 items-center px-1">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 min-w-[120px] max-w-[200px] h-8 text-sm rounded-t-lg cursor-pointer transition-colors border-r border-border/50",
              tab.id === activeTabId
                ? "bg-background text-foreground border-t-2 border-t-primary"
                : "bg-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
            onClick={() => onTabClick(tab.id)}
          >
            {getIconForType(tab.type)}
            <span className="truncate flex-1">{tab.title}</span>
            <div
              className={cn(
                "opacity-0 group-hover:opacity-100 p-0.5 rounded-sm hover:bg-destructive/10 hover:text-destructive transition-all",
                tab.id === activeTabId && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            >
              <X className="w-3 h-3" />
            </div>
          </div>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-1 rounded-md"
          onClick={onNewTab}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
