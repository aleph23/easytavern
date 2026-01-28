import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings, APIProvider, ChatSettings } from '@/types/chat';
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
  {
    id: 'webllm',
    name: 'WebLLM (In-Browser)',
    type: 'webllm',
    baseUrl: '',
    models: [
      'Llama-3.2-3B-Instruct-q4f32_1-MLC',
      'Llama-3-8B-Instruct-q4f32_1-MLC',
      'Hermes-2-Pro-Llama-3-8B-q4f16_1-MLC',
      'Phi-3.5-mini-instruct-q4f16_1-MLC',
    ],
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

const STORAGE_KEY = 'nexus-chat-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { providers: DEFAULT_PROVIDERS, chatSettings: DEFAULT_CHAT_SETTINGS };
      }
    }
    return { providers: DEFAULT_PROVIDERS, chatSettings: DEFAULT_CHAT_SETTINGS };
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load
  useEffect(() => {
    const loadSettings = async () => {
      if (electronApi.isAvailable()) {
        try {
          const res = await electronApi.settings.read();
          if (res.success && res.data) {
            setSettings(res.data);
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

  const resetSettings = useCallback(() => {
    setSettings({ providers: DEFAULT_PROVIDERS, chatSettings: DEFAULT_CHAT_SETTINGS });
  }, []);

  return {
    settings,
    updateProvider,
    addProvider,
    removeProvider,
    updateChatSettings,
    resetSettings,
    isLoaded
  };
};
