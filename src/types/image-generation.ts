export type ImageStyle = 'graphic_novel' | 'realistic_anime' | 'photorealism' | 'user_defined';

export interface ImageProvider {
  id: string;
  name: string;
  type: 'automatic1111' | 'comfyui' | 'openai' | 'pollinations' | 'chutes' | 'openrouter' | 'custom';
  baseUrl: string;
  apiKey?: string;
  enabled: boolean;
  models?: string[]; // Optional for providers like Chutes/OpenRouter that support multiple image models
}

export interface ImageGenerationSettings {
  enabled: boolean;
  activeProvider: string;
  generationFrequency: number; // 0 = off, 1-10 turns
  style: ImageStyle;
  customStylePrompt?: string;
  negativePrompt: string;
  providers: ImageProvider[];
}

export interface GeneratedImage {
  id: string;
  path: string;
  prompt: string;
  createdAt: number;
  provider: string;
}
