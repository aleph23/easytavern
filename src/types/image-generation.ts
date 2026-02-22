export type ImageStyle = 'graphic_novel' | 'realistic_anime' | 'photorealism' | 'user_defined';

export interface ImageProvider {
  id: string;
  name: string;
  type: 'automatic1111' | 'comfyui' | 'openai' | 'pollinations' | 'custom';
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
}

export interface ImageGenerationSettings {
  enabled: boolean; // Main toggle or derived from frequency? Plan says 0 = off.
  activeProvider: string;
  generationFrequency: number; // 0 = off, 1-10 turns
  style: ImageStyle;
  customStylePrompt?: string; // Prepend text for user-defined style
  negativePrompt: string;
  providers: ImageProvider[];
}

export interface GeneratedImage {
  id: string;
  path: string; // Local path relative to chat folder or absolute? Maybe relative to app data?
  prompt: string;
  createdAt: number;
  provider: string;
}
