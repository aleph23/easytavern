import React from 'react';
import { TabBar } from './TabBar';
import { TabContent } from './TabContent';
import { useTabManager } from '@/hooks/useTabManager';
import { AppBackground } from '@/components/layout/AppBackground';

export const TabManager = () => {
  const { tabs, activeTabId, createTab, closeTab, setActiveTab } = useTabManager();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <AppBackground />
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onNewTab={() => createTab('chat')}
      />
      <div className="flex-1 relative overflow-hidden z-10">
        {tabs.map(tab => (
          <TabContent
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
          />
        ))}
      </div>
    </div>
  );
};
