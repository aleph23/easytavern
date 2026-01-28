import React from 'react';
import { Tab } from '@/types/tabs';
import { cn } from '@/lib/utils';
import { Chat } from './Chat';
import { Settings } from './Settings';

interface TabContentProps {
  tab: Tab;
  isActive: boolean;
}

export const TabContent: React.FC<TabContentProps> = ({ tab, isActive }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full bg-background transition-opacity duration-200",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
      )}
    >
      {tab.type === 'chat' ? (
        <Chat />
      ) : tab.type === 'settings' ? (
        <Settings />
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Tab type {tab.type} not implemented
        </div>
      )}
    </div>
  );
};
