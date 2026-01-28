import React from 'react';
import { TabBar } from './TabBar';
import { TabContent } from './TabContent';
import { useTabManager } from '@/hooks/useTabManager';

export const TabManager = () => {
  const { tabs, activeTabId, createTab, closeTab, setActiveTab } = useTabManager();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTab}
        onTabClose={closeTab}
        onNewTab={() => createTab('chat')}
      />
      <div className="flex-1 relative overflow-hidden">
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
