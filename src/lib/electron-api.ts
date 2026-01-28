// Wrapper for Electron IPC calls
// This allows us to handle browser-fallback (if we decide to support it) or mock it for tests

export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && !!window.electron;
};

export const electronApi = {
  isAvailable: isElectron,

  fs: {
    readFile: async (path: string) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.fs.readFile(path);
    },
    writeFile: async (path: string, content: string) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.fs.writeFile(path, content);
    },
    readDir: async (path: string) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.fs.readDir(path);
    },
    deleteFile: async (path: string) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.fs.deleteFile(path);
    },
  },

  dialog: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openFile: async (options: any) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.dialog.openFile(options);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveFile: async (options: any) => {
      if (!isElectron()) throw new Error('Electron API not available');
      return window.electron.dialog.saveFile(options);
    },
  },

  app: {
    getDataPath: async () => {
      if (!isElectron()) return '';
      return window.electron.app.getDataPath();
    },
    getPath: async (name: string) => {
      if (!isElectron()) return '';
      return window.electron.app.getPath(name);
    },
  },

  settings: {
    read: async () => {
      if (!isElectron()) return { success: false, error: 'Not in Electron' };
      return window.electron.settings.read();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write: async (settings: any) => {
      if (!isElectron()) return { success: false, error: 'Not in Electron' };
      return window.electron.settings.write(settings);
    },
  },

  character: {
    list: async () => {
      if (!isElectron()) return { success: false, error: 'Not in Electron' };
      return window.electron.character.list();
    },
    read: async (filename: string) => {
      if (!isElectron()) return { success: false, error: 'Not in Electron', type: 'string' };
      return window.electron.character.read(filename);
    },
    write: async (filename: string, content: string | Buffer) => {
      if (!isElectron()) return { success: false, error: 'Not in Electron' };
      return window.electron.character.write(filename, content);
    },
    delete: async (filename: string) => {
      if (!isElectron()) return { success: false, error: 'Not in Electron' };
      return window.electron.character.delete(filename);
    }
  }
};
