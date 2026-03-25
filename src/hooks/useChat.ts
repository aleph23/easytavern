import { useState, useCallback, useEffect } from 'react';
import { Message, ChatSettings, APIProvider } from '@/types/chat';
import { ImageGenerationSettings } from '@/types/image-generation';
import { apiClient } from '@/lib/api-client';
import { useDebugLog } from '@/contexts/DebugContext';
import { saveChat, getChatFolder, saveImage } from '@/lib/chat-persistence';
import { getStylePrompt } from '@/lib/image-utils';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatFolder, setChatFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addLog } = useDebugLog();

  // Auto-save chat
  useEffect(() => {
    if (chatFolder && messages.length > 0) {
      saveChat(chatFolder, messages);
    }
  }, [messages, chatFolder]);

  const startNewChat = useCallback((characterName: string) => {
    const folder = getChatFolder(characterName);
    setChatFolder(folder);
    setMessages([]);
    setError(null);
  }, []);

  const generateSceneImage = useCallback(async (
    contextMessages: Message[],
    settings: ChatSettings,
    provider: APIProvider,
    imageSettings: ImageGenerationSettings,
    customPrompt?: string, // Optional override for prompt (e.g. for Portrait)
    folderOverride?: string // Optional override for folder (e.g. for Start of Chat)
  ) => {
    const targetFolder = folderOverride || chatFolder;
    if (!imageSettings.enabled || !targetFolder) return;

    try {
        addLog({
            type: 'system',
            direction: 'info',
            content: `Generating scene image. Context: ${contextMessages.length} messages.`
        });

        let generatedPrompt = customPrompt;

        if (!generatedPrompt) {
            // 1. Generate Prompt using LLM
            const contextText = contextMessages.map(m => `${m.role}: ${m.content}`).join('\n');
            const promptRequest = {
                model: settings.activeModel,
                messages: [
                    { role: 'system', content: 'You are an image generation prompt engineer. Describe the current scene based on the conversation. Provide only the visual description, no other text.' },
                    { role: 'user', content: `Context:\n${contextText}\n\nCreate a detailed visual description for an image generator.` }
                ],
                temperature: 0.7,
                max_tokens: 150,
                top_p: 0.9,
                frequency_penalty: 0,
                presence_penalty: 0,
            };

            const promptResponse = await apiClient.chat(provider, promptRequest, addLog);
            generatedPrompt = promptResponse.choices[0]?.message?.content;
        }

        if (generatedPrompt) {
            // 2. Generate Image
            const stylePrompt = getStylePrompt(imageSettings.style, imageSettings.customStylePrompt);
            const fullPrompt = `${stylePrompt}${generatedPrompt}`;
            const imageProvider = imageSettings.providers.find(p => p.id === imageSettings.activeProvider);

            if (imageProvider) {
                const imgResult = await apiClient.generateImage(
                    imageProvider,
                    fullPrompt,
                    imageSettings.negativePrompt,
                    512, 512, 20,
                    addLog
                );

                if (imgResult.format === 'base64') {
                    // 3. Save Image
                    // Use custom filename if provided? Or generic.
                    const filename = `img_${Date.now()}.png`;
                    await saveImage(targetFolder, filename, imgResult.data);

                    // 4. Add Image Message
                    const imageMessage: Message = {
                        id: generateId(),
                        role: 'assistant',
                        content: `![Generated Image](data:image/png;base64,${imgResult.data})\n\n*${generatedPrompt}*`,
                        timestamp: new Date(),
                        model: 'image-gen'
                    };
                    setMessages(prev => [...prev, imageMessage]);
                }
            } else {
                addLog({ type: 'image', direction: 'error', content: 'No active image provider found.' });
            }
        }
    } catch (err) {
        console.error("Image generation failed", err);
        addLog({ type: 'image', direction: 'error', content: err });
    }
  }, [addLog, chatFolder]);

  const sendMessage = useCallback(async (
    content: string,
    settings: ChatSettings,
    providers: APIProvider[],
    imageSettings: ImageGenerationSettings
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

      const requestPayload = {
        model: settings.activeModel,
        messages: messagesForAPI,
        temperature: settings.temperature,
        max_tokens: settings.maxTokens,
        top_p: settings.topP,
        frequency_penalty: settings.frequencyPenalty,
        presence_penalty: settings.presencePenalty,
      };

      const data = await apiClient.chat(provider, requestPayload, addLog);

      const assistantContent = data.choices?.[0]?.message?.content || 'No response';

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        model: settings.activeModel,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Image Generation Logic
      const freq = imageSettings.generationFrequency;
      if (imageSettings.enabled && freq > 0 && chatFolder) {
        const currentTotal = messages.length + 2;
        const currentTurn = Math.floor(currentTotal / 2);

        if (currentTurn % freq === 0) {
          const numContextMessages = freq === 1 ? 2 : 4;
          const currentMessages = [...messages, userMessage, assistantMessage];
          const context = currentMessages.slice(-numContextMessages);

          // Call helper
          await generateSceneImage(context, settings, provider, imageSettings);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      addLog({ type: 'system', direction: 'error', content: err });
    } finally {
      setIsLoading(false);
    }
  }, [messages, addLog, chatFolder, generateSceneImage]);

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
    startNewChat,
    chatFolder,
    generateSceneImage,
  };
};
