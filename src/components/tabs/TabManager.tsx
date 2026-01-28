import React, { useEffect } from 'react';
import { TabBar } from './TabBar';
import { TabContent } from './TabContent';
import { useTabManager } from '@/hooks/useTabManager';

export const TabManager = () => {
  const { tabs, activeTabId, createTab, closeTab, setActiveTab } = useTabManager();

  useEffect(() => {
    const handleOpenSettings = () => {
      // Check if settings tab exists
      const settingsTab = tabs.find(t => t.type === 'settings');
      if (settingsTab) {
        setActiveTab(settingsTab.id);
      } else {
        createTab('settings');
      }
    };

    window.addEventListener('open-settings-tab', handleOpenSettings);
    return () => window.removeEventListener('open-settings-tab', handleOpenSettings);
  }, [tabs, createTab, setActiveTab]);

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
