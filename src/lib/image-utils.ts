import { ImageStyle } from '@/types/image-generation';

export const getStylePrompt = (style: ImageStyle, customStyle?: string) => {
  switch (style) {
    case 'graphic_novel': return "graphic novel style, comic book art, high contrast, ";
    case 'realistic_anime': return "realistic anime style, detailed, makoto shinkai style, ";
    case 'photorealism': return "photorealistic, 8k, highly detailed, realistic texture, ";
    case 'user_defined': return customStyle ? `${customStyle}, ` : "";
    default: return "";
  }
};
