import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings, APIProvider, ChatSettings } from '@/types/chat';
import { ImageGenerationSettings, ImageProvider } from '@/types/image-generation';
import { electronApi } from '@/lib/electron-api';

const DEFAULT_PROVIDERS: APIProvider[] = [
  {
    id: 'ollama',
    name: 'Ollama',
    type: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    models: ['llama3.2', 'mistral', 'codellama', 'llama2'],
    enabled: true,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    enabled: false,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    type: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: '',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
    enabled: false,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'openrouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: '',
    models: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'google/gemini-pro'],
    enabled: false,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    type: 'custom',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    models: ['deepseek-chat', 'deepseek-coder'],
    enabled: false,
  },
  {
    id: 'koboldcpp',
    name: 'KoboldCpp',
    type: 'koboldcpp',
    baseUrl: 'http://localhost:5001/v1',
    models: ['local-model'],
    enabled: false,
  },
  {
    id: 'llamacpp',
    name: 'LlamaCpp',
    type: 'llamacpp',
    baseUrl: 'http://localhost:8080/v1',
    models: ['local-model'],
    enabled: false,
  },
];

const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  activeProvider: 'ollama',
  activeModel: 'llama3.2',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: 'You are a helpful assistant.',
};

const DEFAULT_IMAGE_PROVIDERS: ImageProvider[] = [
  {
    id: 'automatic1111',
    name: 'Automatic1111',
    type: 'automatic1111',
    baseUrl: 'http://localhost:7860',
    enabled: true,
  },
  {
    id: 'openai',
    name: 'OpenAI (DALL-E)',
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    enabled: false,
  },
  {
    id: 'pollinations',
    name: 'Pollinations.ai',
    type: 'pollinations',
    baseUrl: 'https://image.pollinations.ai',
    enabled: false,
  }
];

const DEFAULT_IMAGE_SETTINGS: ImageGenerationSettings = {
  enabled: true,
  activeProvider: 'automatic1111',
  generationFrequency: 0,
  style: 'graphic_novel',
  negativePrompt: 'blurry, low quality, distorted, ugly, bad anatomy',
  providers: DEFAULT_IMAGE_PROVIDERS,
};

const STORAGE_KEY = 'nexus-chat-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migration/Fallback for existing settings
        return {
          providers: parsed.providers || DEFAULT_PROVIDERS,
          chatSettings: parsed.chatSettings || DEFAULT_CHAT_SETTINGS,
          imageGeneration: parsed.imageGeneration || DEFAULT_IMAGE_SETTINGS,
          activeCharacter: parsed.activeCharacter
        };
      } catch {
        return {
          providers: DEFAULT_PROVIDERS,
          chatSettings: DEFAULT_CHAT_SETTINGS,
          imageGeneration: DEFAULT_IMAGE_SETTINGS
        };
      }
    }
    return {
      providers: DEFAULT_PROVIDERS,
      chatSettings: DEFAULT_CHAT_SETTINGS,
      imageGeneration: DEFAULT_IMAGE_SETTINGS
    };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    const loadSettings = async () => {
      if (electronApi.isAvailable()) {
        try {
          const res = await electronApi.settings.read();
          if (res.success && res.data) {
            setSettings(prev => ({
              ...prev, // Keep defaults if missing in file
              ...res.data,
              imageGeneration: res.data.imageGeneration || DEFAULT_IMAGE_SETTINGS
            }));
          }
          // If no data, we keep the initial state (from localStorage)
          // and it will be saved to file in the next effect
        } catch (error) {
          console.error('Failed to load settings from file:', error);
        }
      }
      setIsLoaded(true);
    };
    loadSettings();
  }, []);

  // Persistence
  useEffect(() => {
    if (!isLoaded) return;

    if (electronApi.isAvailable()) {
      electronApi.settings.write(settings).catch(err =>
        console.error('Failed to save settings to file:', err)
      );
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateProvider = useCallback((id: string, updates: Partial<APIProvider>) => {
    setSettings(prev => ({
      ...prev,
      providers: prev.providers.map(p => 
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
  }, []);

  const addProvider = useCallback((provider: APIProvider) => {
    setSettings(prev => ({
      ...prev,
      providers: [...prev.providers, provider],
    }));
  }, []);

  const removeProvider = useCallback((id: string) => {
    setSettings(prev => ({
      ...prev,
      providers: prev.providers.filter(p => p.id !== id),
    }));
  }, []);

  const updateChatSettings = useCallback((updates: Partial<ChatSettings>) => {
    setSettings(prev => ({
      ...prev,
      chatSettings: { ...prev.chatSettings, ...updates },
    }));
  }, []);

  const updateImageSettings = useCallback((updates: Partial<ImageGenerationSettings>) => {
    setSettings(prev => ({
      ...prev,
      imageGeneration: { ...prev.imageGeneration, ...updates },
    }));
  }, []);

  const updateImageProvider = useCallback((id: string, updates: Partial<ImageProvider>) => {
    setSettings(prev => ({
      ...prev,
      imageGeneration: {
        ...prev.imageGeneration,
        providers: prev.imageGeneration.providers.map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
      },
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      providers: DEFAULT_PROVIDERS,
      chatSettings: DEFAULT_CHAT_SETTINGS,
      imageGeneration: DEFAULT_IMAGE_SETTINGS
    });
  }, []);

  return {
    settings,
    updateProvider,
    addProvider,
    removeProvider,
    updateChatSettings,
    updateImageSettings,
    updateImageProvider,
    resetSettings,
    isLoaded
  };
};
