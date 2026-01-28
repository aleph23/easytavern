export type TabType = 'chat' | 'character-editor' | 'settings' | 'extensions' | 'world-info';

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // Tab specific data
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string;
}

export interface TabManager {
  tabs: Tab[];
  activeTabId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createTab: (type: TabType, data?: any) => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
}
