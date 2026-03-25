export interface IElectronAPI {
  fs: {
    readFile: (filePath: string) => Promise<{ success: boolean; data?: string | Buffer; error?: string }>;
    writeFile: (filePath: string, content: string | Buffer) => Promise<{ success: boolean; error?: string }>;
    readDir: (dirPath: string) => Promise<{ success: boolean; data?: string[]; error?: string }>;
    deleteFile: (filePath: string) => Promise<{ success: boolean; error?: string }>;
    createDir: (dirPath: string) => Promise<{ success: boolean; error?: string }>;
    exists: (filePath: string) => Promise<{ success: boolean; exists: boolean; error?: string }>;
  };
  dialog: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openFile: (options: any) => Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveFile: (options: any) => Promise<any>;
  };
  app: {
    getDataPath: () => Promise<string>;
    getPath: (name: string) => Promise<string>;
  };
  settings: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    read: () => Promise<{ success: boolean; data?: any }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write: (settings: any) => Promise<{ success: boolean; error?: string }>;
  };
  character: {
    list: () => Promise<{ success: boolean; data?: string[]; error?: string }>;
    read: (filename: string) => Promise<{ success: boolean; data?: string | Buffer; type: 'string' | 'buffer'; error?: string }>;
    write: (filename: string, content: string | Buffer) => Promise<{ success: boolean; error?: string }>;
    delete: (filename: string) => Promise<{ success: boolean; error?: string }>;
  };
  onNewChat: (callback: () => void) => () => void;
  onImportCharacter: (callback: (filePath: string) => void) => () => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
