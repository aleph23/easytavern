import React, { createContext, useContext, ReactNode } from 'react';
import { useTabManager } from '@/hooks/useTabManager';
import { TabManager } from '@/types/tabs';

const TabContext = createContext<TabManager | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const tabManager = useTabManager();
  return <TabContext.Provider value={tabManager}>{children}</TabContext.Provider>;
};

export const useTabs = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error('useTabs must be used within a TabProvider');
  return context;
};
