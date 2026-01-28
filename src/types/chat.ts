export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
}

export interface Character {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  systemPrompt: string;
  greeting?: string;
}

export interface APIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'ollama' | 'koboldcpp' | 'llamacpp' | 'openrouter' | 'webllm' | 'custom';
  baseUrl: string;
  apiKey?: string;
  models: string[];
  enabled: boolean;
}

export interface ChatSettings {
  activeProvider: string;
  activeModel: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
}

export interface AppSettings {
  providers: APIProvider[];
  chatSettings: ChatSettings;
  activeCharacter?: Character;
}
