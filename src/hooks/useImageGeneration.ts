import { useState, useCallback } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { apiClient } from '@/lib/api-client';
import { useDebugLog } from '@/contexts/DebugContext';
import { ImageStyle } from '@/types/image-generation';

export const useImageGeneration = () => {
  const { settings } = useSettings();
  const { addLog } = useDebugLog();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStylePrompt = (style: ImageStyle, customStyle?: string) => {
    switch (style) {
        case 'graphic_novel': return "graphic novel style, comic book art, high contrast, ";
        case 'realistic_anime': return "realistic anime style, detailed, makoto shinkai style, ";
        case 'photorealism': return "photorealistic, 8k, highly detailed, realistic texture, ";
        case 'user_defined': return customStyle ? `${customStyle}, ` : "";
        default: return "";
    }
  };

  const generate = useCallback(async (prompt: string) => {
    const imgSettings = settings.imageGeneration;
    // Even if enabled is false in settings, we might want to force generate manually?
    // But for inline/auto generation, we check enabled.
    // The hook provides the capability. The caller decides policy?
    // Let's assume this function just generates.

    const provider = imgSettings.providers.find(p => p.id === imgSettings.activeProvider);
    if (!provider) {
      const msg = "No active image provider selected";
      setError(msg);
      addLog({ type: 'image', direction: 'error', content: msg });
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
        const stylePrompt = getStylePrompt(imgSettings.style, imgSettings.customStylePrompt);
        const fullPrompt = `${stylePrompt}${prompt}`;
        const negative = imgSettings.negativePrompt;

        // Log the constructed prompt
        addLog({
            type: 'image',
            direction: 'info',
            content: { fullPrompt, negative, provider: provider.name },
            provider: provider.name
        });

        const result = await apiClient.generateImage(
            provider,
            fullPrompt,
            negative,
            512, // Default width - could be setting
            512, // Default height - could be setting
            20,  // Default steps - could be setting
            addLog
        );

        return result;
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        // Error is already logged by apiClient
        return null;
    } finally {
        setIsGenerating(false);
    }
  }, [settings.imageGeneration, addLog]);

  return {
    generate,
    isGenerating,
    error
  };
};
