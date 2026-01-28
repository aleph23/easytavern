import { useState, useCallback } from 'react';
import { Tab, TabType, TabManager } from '@/types/tabs';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useTabManager = (): TabManager => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 'default', title: 'New Chat', type: 'chat' }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('default');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createTab = useCallback((type: TabType = 'chat', data?: any) => {
    const newTab: Tab = {
      id: generateId(),
      title: type === 'chat' ? 'New Chat' : type.charAt(0).toUpperCase() + type.slice(1),
      type,
      data,
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback((id: string) => {
    if (tabs.length <= 1 && tabs[0].id === id) return;

    const index = tabs.findIndex(t => t.id === id);
    if (index === -1) return;

    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);

    if (id === activeTabId) {
        const nextIndex = Math.max(0, index - 1);
        // If newTabs is empty (shouldn't happen due to check above), this would fail.
        if (newTabs.length > 0) {
            const nextTab = newTabs[Math.min(nextIndex, newTabs.length - 1)];
            setActiveTabId(nextTab.id);
        }
    }
  }, [tabs, activeTabId]);

  const setActiveTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const updateTab = useCallback((id: string, updates: Partial<Tab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  return {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    setActiveTab,
    updateTab,
  };
};
