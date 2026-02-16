import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type BackgroundType = 'none' | 'dotted-glow' | 'beams' | 'image';

export interface BackgroundSettings {
  type: BackgroundType;
  imageUrl?: string;
}

interface BackgroundContextValue {
  background: BackgroundSettings;
  setBackgroundType: (type: BackgroundType) => void;
  setBackgroundImage: (url: string) => void;
}

const STORAGE_KEY = 'nexus-background';

const loadBackground = (): BackgroundSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { type: 'dotted-glow' };
};

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const [background, setBackground] = useState<BackgroundSettings>(loadBackground);

  const persist = (next: BackgroundSettings) => {
    setBackground(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const setBackgroundType = useCallback((type: BackgroundType) => {
    persist({ ...loadBackground(), type });
  }, []);

  const setBackgroundImage = useCallback((url: string) => {
    persist({ type: 'image', imageUrl: url });
  }, []);

  return (
    <BackgroundContext.Provider value={{ background, setBackgroundType, setBackgroundImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used within BackgroundProvider');
  return ctx;
};
