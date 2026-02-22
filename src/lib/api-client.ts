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
          const encodedPrompt = encodeURIComponent(prompt);
          const url = `${provider.baseUrl}/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${Math.floor(Math.random()*1000)}&nologo=true`;

          // Pollinations returns the image binary directly on GET/POST
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Pollinations Error: ${response.status}`);

          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          result = { data: base64, format: 'base64' };
      }
      else if (provider.type === 'openrouter' || provider.type === 'chutes') {
          // OpenRouter uses standard OpenAI format but to a different endpoint
          // Chutes also uses standard OpenAI format

          const payload = {
            // Use configured model or fallback
            model: provider.models?.[0] || (provider.type === 'openrouter' ? 'stabilityai/stable-diffusion-xl-base-1.0' : 'flux-pro'),
            prompt: prompt,
            n: 1,
            size: `${width}x${height}`,
          };

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.apiKey}`,
          };

          if (provider.type === 'openrouter') {
             headers['HTTP-Referer'] = 'https://easytavern.app';
             headers['X-Title'] = 'EasyTavern';
          }

          const response = await fetch(`${provider.baseUrl}/images/generations`, {
              method: 'POST',
              headers,
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const text = await response.text();
              throw new Error(`${provider.name} Error: ${response.status} - ${text}`);
          }

          const data = await response.json();
          // Check for URL or b64_json
          // OpenRouter/Chutes usually return URL
          if (data.data?.[0]?.b64_json) {
              result = { data: data.data[0].b64_json, format: 'base64' };
          } else if (data.data?.[0]?.url) {
              const imgRes = await fetch(data.data[0].url);
              const blob = await imgRes.blob();
              const base64 = await blobToBase64(blob);
              result = { data: base64, format: 'base64' };
          } else {
              // Fallback check for raw url in some non-standard responses?
              // Standard is data[0].url
              throw new Error('Invalid response format from provider');
          }
      }
      else if (provider.type === 'minimax') {
          // MiniMax T2I
          // Docs: https://platform.minimax.io/docs/api-reference/image-generation-t2i
          const payload = {
              model: provider.models?.[0] || 'image-01', // Default model if not specified
              prompt,
              size: `${width}x${height}`,
              response_format: 'url' // MiniMax supports 'url' or 'b64_json' (if documented, assuming standard)
          };

          const response = await fetch(`${provider.baseUrl}/text_to_image`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${provider.apiKey}`
              },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const text = await response.text();
              throw new Error(`MiniMax Error: ${response.status} - ${text}`);
          }

          // MiniMax response structure usually follows OpenAI but might differ slightly.
          // Assuming standard response for now based on common practices, or we check docs.
          // Docs say:
          // { "created": 123, "data": [ { "url": "..." } ] }
          const data = await response.json();

          if (data.data?.[0]?.url) {
              const imgRes = await fetch(data.data[0].url);
              const blob = await imgRes.blob();
              const base64 = await blobToBase64(blob);
              result = { data: base64, format: 'base64' };
          } else if (data.data?.[0]?.b64_json) {
              result = { data: data.data[0].b64_json, format: 'base64' };
          } else {
               throw new Error('Invalid response format from MiniMax');
          }
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
