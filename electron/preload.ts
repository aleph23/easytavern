import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // File System
  fs: {
    readFile: (filePath: string) => ipcRenderer.invoke('fs:readFile', filePath),
    writeFile: (filePath: string, content: string) => ipcRenderer.invoke('fs:writeFile', filePath, content),
    readDir: (dirPath: string) => ipcRenderer.invoke('fs:readDir', dirPath),
    deleteFile: (filePath: string) => ipcRenderer.invoke('fs:deleteFile', filePath),
  },

  // Dialog
  dialog: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    openFile: (options: any) => ipcRenderer.invoke('dialog:openFile', options),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    saveFile: (options: any) => ipcRenderer.invoke('dialog:saveFile', options),
  },

  // App
  app: {
    getDataPath: () => ipcRenderer.invoke('app:getDataPath'),
    getPath: (name: string) => ipcRenderer.invoke('app:getPath', name),
  },

  // Settings
  settings: {
    read: () => ipcRenderer.invoke('settings:read'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    write: (settings: any) => ipcRenderer.invoke('settings:write', settings),
  },

  // Character
  character: {
    list: () => ipcRenderer.invoke('character:list'),
    read: (filename: string) => ipcRenderer.invoke('character:read', filename),
    write: (filename: string, content: string | Buffer) => ipcRenderer.invoke('character:write', filename, content),
    delete: (filename: string) => ipcRenderer.invoke('character:delete', filename),
  },

  // Events
  onNewChat: (callback: () => void) => {
    const subscription = (_event: IpcRendererEvent) => callback();
    ipcRenderer.on('menu-new-chat', subscription);
    return () => ipcRenderer.removeListener('menu-new-chat', subscription);
  },
  onImportCharacter: (callback: (filePath: string) => void) => {
    const subscription = (_event: IpcRendererEvent, filePath: string) => callback(filePath);
    ipcRenderer.on('menu-import-character', subscription);
    return () => ipcRenderer.removeListener('menu-import-character', subscription);
  },
});
