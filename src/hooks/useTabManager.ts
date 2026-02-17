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
    setTabs(prev => {
      if (prev.length === 1) return prev; // Don't close last tab

      const newTabs = prev.filter(t => t.id !== id);

      // If closing active tab, activate the last one
      if (id === activeTabId) {
        // We need to use the calculated newTabs to determine the next active tab
        // However, activeTabId state update must happen outside this functional update if we rely on newTabs
        // But we are inside setTabs.
        // We can't update activeTabId state from inside setTabs callback safely if it depends on the result.
        // Actually, we can just do it in a useEffect or logic before setTabs.
        // But since we need the previous state...

        // Let's change the logic to not use functional update for complex dependent state or handle it better.
        // Or we can just calculate nextActiveId here but we can't call setActiveTabId from here.
        return prev; // Fallback, we will handle logic outside
      }
      return newTabs;
    });
  }, [activeTabId]);

  // Refined closeTab to handle active tab switching properly
  const closeTabRefined = useCallback((id: string) => {
    setTabs(prev => {
      if (prev.length <= 1 && prev[0].id === id) return prev; // Don't close last tab

      const index = prev.findIndex(t => t.id === id);
      if (index === -1) return prev;

      const newTabs = prev.filter(t => t.id !== id);

      if (id === activeTabId) {
        // Switch to the tab to the left, or the last tab if index 0
        const nextIndex = Math.max(0, index - 1);
        // If we closed the only tab (prevented above) or something
        // Just pick the one at nextIndex if it exists
        if (newTabs.length > 0) {
           setActiveTabId(newTabs[Math.min(nextIndex, newTabs.length - 1)].id);
        }
      }
      return newTabs;
    });
  }, [activeTabId]);

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
    closeTab: closeTabRefined,
    setActiveTab,
    updateTab,
  };
};
