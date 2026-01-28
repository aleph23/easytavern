import React, { useState, useEffect } from 'react';
import { TabBar } from './TabBar';
import { Tab, TabType } from '@/types/tab';
import Index from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const TabManager = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'default', title: 'New Chat', type: 'chat', isActive: true }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('default');

  const handleNewTab = () => {
    const newTab: Tab = {
      id: generateId(),
      title: 'New Chat',
      type: 'chat',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleTabClose = (id: string) => {
    if (tabs.length === 1) return; // Don't close the last tab

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (activeTabId === id) {
      // Activate the last tab
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      <div className="flex-1 relative overflow-hidden">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={cn(
              "absolute inset-0 w-full h-full bg-background transition-opacity duration-200",
              tab.id === activeTabId ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
             {/* Render content based on type. Currently only chat is fully supported via Index */}
            {tab.type === 'chat' ? (
              <Index />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Tab type {tab.type} not implemented
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
