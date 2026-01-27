import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Store reference to main window
let mainWindow: BrowserWindow | null = null;

// Get app data directory for settings and chat storage
const getAppDataPath = () => {
  return isDev
    ? path.join(process.cwd(), 'dev-data')
    : path.join(app.getPath('userData'), 'data');
};

// Ensure app data directory exists
const ensureDataDirectory = async () => {
  const dataPath = getAppDataPath();
  try {
    await fs.mkdir(dataPath, { recursive: true });
    await fs.mkdir(path.join(dataPath, 'characters'), { recursive: true });
    await fs.mkdir(path.join(dataPath, 'chats'), { recursive: true });
    await fs.mkdir(path.join(dataPath, 'extensions'), { recursive: true });
    await fs.mkdir(path.join(dataPath, 'settings'), { recursive: true });
  } catch (error) {
    console.error('Failed to create data directories:', error);
  }
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // Required for some IPC operations
    },
    title: 'EasyTavern',
    backgroundColor: '#1a1a1a',
    show: false, // Show after ready-to-show event
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
};

const createMenu = () => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-new-chat');
          },
        },
        { type: 'separator' },
        {
          label: 'Import Character',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [
                { name: 'Character Cards', extensions: ['png', 'json'] },
                { name: 'All Files', extensions: ['*'] },
              ],
            });
            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow?.webContents.send('menu-import-character', result.filePaths[0]);
            }
          },
        },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

// App lifecycle events
app.whenReady().then(async () => {
  await ensureDataDirectory();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// File system operations
ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('fs:writeFile', async (_event, filePath: string, content: string) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('fs:readDir', async (_event, dirPath: string) => {
  try {
    const files = await fs.readdir(dirPath);
    return { success: true, data: files };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('fs:deleteFile', async (_event, filePath: string) => {
  try {
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Dialog operations
ipcMain.handle('dialog:openFile', async (_event, options) => {
  const result = await dialog.showOpenDialog(options);
  return result;
});

ipcMain.handle('dialog:saveFile', async (_event, options) => {
  const result = await dialog.showSaveDialog(options);
  return result;
});

// App data path
ipcMain.handle('app:getDataPath', async () => {
  return getAppDataPath();
});

ipcMain.handle('app:getPath', async (_event, name: string) => {
  return app.getPath(name as any);
});

// Settings operations (stored in app data directory)
ipcMain.handle('settings:read', async () => {
  try {
    const settingsPath = path.join(getAppDataPath(), 'settings', 'app-settings.json');
    const content = await fs.readFile(settingsPath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch (error) {
    // Return empty settings if file doesn't exist
    return { success: true, data: null };
  }
});

ipcMain.handle('settings:write', async (_event, settings: any) => {
  try {
    const settingsPath = path.join(getAppDataPath(), 'settings', 'app-settings.json');
    await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// Character operations
ipcMain.handle('character:list', async () => {
  try {
    const charactersPath = path.join(getAppDataPath(), 'characters');
    const files = await fs.readdir(charactersPath);
    const characters = files.filter(f => f.endsWith('.png') || f.endsWith('.json'));
    return { success: true, data: characters };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('character:read', async (_event, filename: string) => {
  try {
    const charactersPath = path.join(getAppDataPath(), 'characters', filename);
    const content = await fs.readFile(charactersPath);
    // Return as Buffer for PNG files, string for JSON
    if (filename.endsWith('.png')) {
      return { success: true, data: content, type: 'buffer' };
    } else {
      return { success: true, data: content.toString('utf-8'), type: 'string' };
    }
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('character:write', async (_event, filename: string, content: Buffer | string) => {
  try {
    const charactersPath = path.join(getAppDataPath(), 'characters', filename);
    await fs.writeFile(charactersPath, content);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('character:delete', async (_event, filename: string) => {
  try {
    const charactersPath = path.join(getAppDataPath(), 'characters', filename);
    await fs.unlink(charactersPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
