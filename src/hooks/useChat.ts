import { useState, useCallback } from 'react';
import { Message, ChatSettings, APIProvider } from '@/types/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    content: string,
    settings: ChatSettings,
    providers: APIProvider[]
  ) => {
    const provider = providers.find(p => p.id === settings.activeProvider);
    if (!provider) {
      setError('No provider selected');
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const messagesForAPI = [
        ...(settings.systemPrompt ? [{ role: 'system' as const, content: settings.systemPrompt }] : []),
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content },
      ];

      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(provider.apiKey && { 'Authorization': `Bearer ${provider.apiKey}` }),
        },
        body: JSON.stringify({
          model: settings.activeModel,
          messages: messagesForAPI,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens,
          top_p: settings.topP,
          frequency_penalty: settings.frequencyPenalty,
          presence_penalty: settings.presencePenalty,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'No response';

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        model: settings.activeModel,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const deleteMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const editMessage = useCallback((id: string, content: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, content } : m
    ));
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    deleteMessage,
    editMessage,
    setMessages,
  };
};
