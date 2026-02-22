export const electronApi = {
  isAvailable: () => typeof window !== 'undefined' && !!window.electron,

  fs: {
    readFile: async (filePath: string) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.fs.readFile(filePath);
    },
    writeFile: async (filePath: string, content: string | Buffer) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.fs.writeFile(filePath, content);
    },
    createDir: async (dirPath: string) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.fs.createDir(dirPath);
    },
    exists: async (filePath: string) => {
      if (!window.electron) return { success: true, exists: false };
      return window.electron.fs.exists(filePath);
    },
    readDir: async (dirPath: string) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.fs.readDir(dirPath);
    },
    deleteFile: async (filePath: string) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.fs.deleteFile(filePath);
    },
  },

  dialog: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openFile: async (options: any) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.dialog.openFile(options);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveFile: async (options: any) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.dialog.saveFile(options);
    },
  },

  app: {
    getDataPath: async () => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.app.getDataPath();
    },
    getPath: async (name: string) => {
      if (!window.electron) throw new Error('Electron API not available');
      return window.electron.app.getPath(name);
    },
  },

  settings: {
    read: async () => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.settings.read();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write: async (settings: any) => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.settings.write(settings);
    },
  },

  character: {
    list: async () => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.character.list();
    },
    read: async (filename: string) => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.character.read(filename);
    },
    write: async (filename: string, content: string | Buffer) => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.character.write(filename, content);
    },
    delete: async (filename: string) => {
      if (!window.electron) return { success: false, error: 'Electron API not available' };
      return window.electron.character.delete(filename);
    },
  },

  onNewChat: (callback: () => void) => {
    if (!window.electron) return () => {};
    return window.electron.onNewChat(callback);
  },

  onImportCharacter: (callback: (filePath: string) => void) => {
    if (!window.electron) return () => {};
    return window.electron.onImportCharacter(callback);
  },
};
