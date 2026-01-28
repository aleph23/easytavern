export type TabType = 'chat' | 'settings' | 'character' | 'extensions' | 'world-info';

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any; // Tab specific data
  isActive?: boolean;
}
