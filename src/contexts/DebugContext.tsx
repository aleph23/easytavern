import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'llm' | 'image' | 'system';
  direction: 'request' | 'response' | 'info' | 'error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  provider?: string;
  model?: string;
}

interface DebugContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: Date.now(),
    };
    setLogs(prev => [...prev, newEntry]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <DebugContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebugLog = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebugLog must be used within a DebugProvider');
  }
  return context;
};
