import { useSettings } from '@/hooks/useSettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageStyle } from '@/types/image-generation';

export const ImageSettings = () => {
  const { settings, updateImageSettings, updateImageProvider } = useSettings();
  const { imageGeneration } = settings;

  const handleProviderChange = (providerId: string) => {
    updateImageSettings({ activeProvider: providerId });
  };

  const handleStyleChange = (style: string) => {
    updateImageSettings({ style: style as ImageStyle });
  };

  const activeProvider = imageGeneration.providers.find(p => p.id === imageGeneration.activeProvider);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable Image Generation</Label>
          <div className="text-sm text-muted-foreground">
            Allow AI to generate images during chat
          </div>
        </div>
        <Switch
          checked={imageGeneration.enabled}
          onCheckedChange={(checked) => updateImageSettings({ enabled: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label>Provider</Label>
        <Select value={imageGeneration.activeProvider} onValueChange={handleProviderChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            {imageGeneration.providers.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeProvider && (
        <div className="space-y-4 p-4 border rounded-lg bg-secondary/20">
            <h3 className="font-medium text-sm">Provider Settings</h3>
            <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                    value={activeProvider.baseUrl}
                    onChange={(e) => updateImageProvider(activeProvider.id, { baseUrl: e.target.value })}
                />
            </div>
            {(activeProvider.type === 'openai' || activeProvider.type === 'openrouter' || activeProvider.type === 'chutes' || activeProvider.type === 'minimax') && (
                <div className="space-y-2">
                    <Label>API Key</Label>
                    <Input
                        type="password"
                        value={activeProvider.apiKey || ''}
                        onChange={(e) => updateImageProvider(activeProvider.id, { apiKey: e.target.value })}
                    />
                </div>
            )}

            {(activeProvider.type === 'openrouter' || activeProvider.type === 'chutes') && (
                 <div className="space-y-2">
                    <Label>Model (Optional)</Label>
                    <Input
                        value={activeProvider.models?.[0] || ''}
                        onChange={(e) => updateImageProvider(activeProvider.id, { models: [e.target.value] })}
                        placeholder="e.g. stabilityai/stable-diffusion-xl-base-1.0"
                    />
                    <p className="text-xs text-muted-foreground">Leave empty to use default</p>
                </div>
            )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
            <Label>Generation Frequency (Every X Turns)</Label>
            <span className="text-sm text-muted-foreground">
                {imageGeneration.generationFrequency === 0 ? 'Off' : `${imageGeneration.generationFrequency} turns`}
            </span>
        </div>
        <Slider
          value={[imageGeneration.generationFrequency]}
          min={0}
          max={10}
          step={1}
          onValueChange={([val]) => updateImageSettings({ generationFrequency: val })}
        />
        <p className="text-xs text-muted-foreground">
            Set to 0 to disable automatic generation. 1 turn = User + AI response.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Style Preset</Label>
        <Select value={imageGeneration.style} onValueChange={handleStyleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="graphic_novel">Graphic Novel</SelectItem>
            <SelectItem value="realistic_anime">Realistic Anime</SelectItem>
            <SelectItem value="photorealism">Photorealism</SelectItem>
            <SelectItem value="user_defined">User Defined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {imageGeneration.style === 'user_defined' && (
        <div className="space-y-2">
            <Label>Custom Style Prompt</Label>
            <Input
                value={imageGeneration.customStylePrompt || ''}
                onChange={(e) => updateImageSettings({ customStylePrompt: e.target.value })}
                placeholder="e.g. oil painting, van gogh style"
            />
        </div>
      )}

      <div className="space-y-2">
        <Label>Negative Prompt</Label>
        <Textarea
          value={imageGeneration.negativePrompt}
          onChange={(e) => updateImageSettings({ negativePrompt: e.target.value })}
          placeholder="Things to avoid in the image..."
          rows={3}
        />
      </div>
    </div>
  );
};
