import { APIProvider } from '@/types/chat';
import { ImageGenerationSettings, ImageProvider } from '@/types/image-generation';

export interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

export interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Log entry compatible with DebugContext
interface LogEntry {
  type: 'llm' | 'image' | 'system';
  direction: 'request' | 'response' | 'info' | 'error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  provider?: string;
  model?: string;
}

type Logger = (entry: LogEntry) => void;

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const result = reader.result as string;
        // remove data:image/png;base64, prefix if present
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const apiClient = {
  chat: async (
    provider: APIProvider,
    request: ChatCompletionRequest,
    log?: Logger
  ): Promise<ChatCompletionResponse> => {

    if (log) {
      log({
        type: 'llm',
        direction: 'request',
        content: request,
        provider: provider.name,
        model: request.model,
      });
    }

    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(provider.apiKey && { 'Authorization': `Bearer ${provider.apiKey}` }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (log) {
        log({
          type: 'llm',
          direction: 'response',
          content: data,
          provider: provider.name,
          model: request.model,
        });
      }

      return data as ChatCompletionResponse;
    } catch (error) {
      if (log) {
        log({
          type: 'llm',
          direction: 'error',
          content: error instanceof Error ? error.message : String(error),
          provider: provider.name,
          model: request.model,
        });
      }
      throw error;
    }
  },

  generateImage: async (
    provider: ImageProvider,
    prompt: string,
    negativePrompt: string = '',
    width: number = 512,
    height: number = 512,
    steps: number = 20,
    log?: Logger
  ): Promise<{ data: string; format: 'base64' | 'url' }> => {

    const requestPayload = { prompt, negativePrompt, width, height, steps };

    if (log) {
      log({
        type: 'image',
        direction: 'request',
        content: requestPayload,
        provider: provider.name,
      });
    }

    try {
      let result: { data: string; format: 'base64' | 'url' };

      if (provider.type === 'automatic1111') {
        const payload = {
            prompt,
            negative_prompt: negativePrompt,
            width,
            height,
            steps,
            sampler_name: "Euler a",
            cfg_scale: 7
        };

        const response = await fetch(`${provider.baseUrl}/sdapi/v1/txt2img`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`SD WebUI Error: ${response.status}`);

        const data = await response.json();
        if (!data.images || data.images.length === 0) throw new Error('No images returned');

        result = { data: data.images[0], format: 'base64' };
      }
      else if (provider.type === 'openai') {
          const payload = {
              model: "dall-e-3",
              prompt,
              n: 1,
              size: "1024x1024",
              response_format: "b64_json"
          };
          const response = await fetch(`${provider.baseUrl}/images/generations`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${provider.apiKey}`
              },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const text = await response.text();
              throw new Error(`OpenAI Error: ${response.status} - ${text}`);
          }

          const data = await response.json();
          result = { data: data.data[0].b64_json, format: 'base64' };
      }
      else if (provider.type === 'pollinations') {
          const url = `${provider.baseUrl}/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${Math.floor(Math.random()*1000)}`;

          const response = await fetch(url);
          if (!response.ok) throw new Error(`Pollinations Error: ${response.status}`);

          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          result = { data: base64, format: 'base64' };
      }
      else {
          throw new Error(`Provider type ${provider.type} not implemented`);
      }

      if (log) {
        log({
            type: 'image',
            direction: 'response',
            content: { format: result.format, dataLength: result.data.length },
            provider: provider.name,
        });
      }

      return result;

    } catch (error) {
       if (log) {
        log({
          type: 'image',
          direction: 'error',
          content: error instanceof Error ? error.message : String(error),
          provider: provider.name,
        });
      }
      throw error;
    }
  }
};
