import { electronApi } from './electron-api';
import { Message } from '@/types/chat';

const generateShortHash = () => Math.random().toString(36).substring(2, 8);

export const getChatFolder = (characterName: string) => {
  const words = characterName.split(' ').slice(0, 2).join('_').replace(/[^a-zA-Z0-9_]/g, '');
  return `${words}_${generateShortHash()}`;
};

export const saveChat = async (folderName: string, messages: Message[]) => {
  if (!electronApi.isAvailable()) return;

  try {
    const appDataPath = await electronApi.app.getDataPath();
    const chatPath = `${appDataPath}/chats/${folderName}`;

    // Ensure dir exists
    const exists = await electronApi.fs.exists(chatPath);
    if (!exists.exists) {
      await electronApi.fs.createDir(chatPath);
    }

    await electronApi.fs.writeFile(`${chatPath}/chat.json`, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Failed to save chat:', error);
  }
};

export const saveImage = async (folderName: string, filename: string, base64Data: string) => {
  if (!electronApi.isAvailable()) return;

  try {
    const appDataPath = await electronApi.app.getDataPath();
    const chatPath = `${appDataPath}/chats/${folderName}`;

    // Ensure dir exists
    const exists = await electronApi.fs.exists(chatPath);
    if (!exists.exists) {
      await electronApi.fs.createDir(chatPath);
    }

    const binary = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Pass as any because TypeScript in frontend doesn't know IPC handles Uint8Array as Buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await electronApi.fs.writeFile(`${chatPath}/${filename}`, binary as any);

    return `${chatPath}/${filename}`;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
};
